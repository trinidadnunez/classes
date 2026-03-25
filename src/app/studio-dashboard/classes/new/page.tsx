'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CLASS_CATEGORIES } from '@/constants/categories';
import { DIFFICULTY_OPTIONS } from '@/constants/filters';

const classSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Select a category'),
  difficulty: z.string().min(1, 'Select a difficulty'),
  duration: z.number().min(15, 'Min 15 minutes').max(180, 'Max 180 minutes'),
  capacity: z.number().min(1, 'Min 1 spot').max(100, 'Max 100 spots'),
  price: z.number().min(0, 'Price cannot be negative').optional(),
  cancellationWindow: z.number().min(1).max(72).optional(),
  rules: z.string().optional(),
});

type ClassFormData = z.infer<typeof classSchema>;

const STEPS = ['Details', 'Schedule', 'Review'] as const;

const NewClassPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [published, setPublished] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      duration: 60,
      capacity: 20,
      cancellationWindow: 24,
    },
  });

  const formValues = watch();

  const onSubmit = () => {
    setPublished(true);
    toast.success('Class published successfully! It will appear in search shortly.');
  };

  if (published) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Class Published!</h1>
        <p className="mt-2 text-muted-foreground">
          &quot;{formValues.title}&quot; has been published and will appear in search results.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="outline" render={<Link href="/studio-dashboard" />}>
            Back to Dashboard
          </Button>
          <Button
            onClick={() => {
              setPublished(false);
              setCurrentStep(0);
            }}
          >
            Publish Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Button variant="ghost" size="sm" className="mb-4" render={<Link href="/studio-dashboard" />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Button>

      <h1 className="text-2xl font-bold mb-2">Publish New Class</h1>
      <p className="text-muted-foreground mb-6">Fill in the details to create a new class listing.</p>

      <div className="flex gap-2 mb-8">
        {STEPS.map((stepLabel, idx) => (
          <div key={stepLabel} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0 ${
                idx <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {idx + 1}
            </div>
            <span className={`text-sm hidden sm:block ${idx <= currentStep ? 'font-medium' : 'text-muted-foreground'}`}>
              {stepLabel}
            </span>
            {idx < STEPS.length - 1 && (
              <div className={`h-px flex-1 ${idx < currentStep ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 0 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Class Title *</Label>
                <Input id="title" placeholder="e.g., Morning Vinyasa Flow" {...register('title')} />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your class..."
                  rows={4}
                  {...register('description')}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formValues.category}
                    onValueChange={(v) => v && setValue('category', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLASS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Difficulty *</Label>
                  <Select
                    value={formValues.difficulty}
                    onValueChange={(v) => v && setValue('difficulty', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.filter((d) => d.value !== 'all').map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules">Rules & What to Bring</Label>
                <Textarea
                  id="rules"
                  placeholder="One rule per line..."
                  rows={3}
                  {...register('rules')}
                />
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setCurrentStep(1)}>
                  Next: Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 1 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input id="duration" type="number" {...register('duration', { valueAsNumber: true })} />
                  {errors.duration && <p className="text-xs text-destructive">{errors.duration.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (spots) *</Label>
                  <Input id="capacity" type="number" {...register('capacity', { valueAsNumber: true })} />
                  {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (ARS, optional)</Label>
                  <Input id="price" type="number" placeholder="0 = free" {...register('price', { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationWindow">Cancellation Window (hours)</Label>
                  <Input id="cancellationWindow" type="number" {...register('cancellationWindow', { valueAsNumber: true })} />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Schedule and recurring rules will be configured after publishing. For this prototype,
                the class will be listed with auto-generated sessions.
              </p>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(0)}>
                  Back
                </Button>
                <Button type="button" onClick={() => setCurrentStep(2)}>
                  Next: Review
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-lg">Review Your Class</h3>
              <div className="rounded-lg bg-muted/50 p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium">{formValues.title || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{formValues.category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-medium">{formValues.difficulty || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{formValues.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium">{formValues.capacity} spots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">
                    {formValues.price ? `$${formValues.price.toLocaleString('es-AR')}` : 'Free'}
                  </span>
                </div>
                {formValues.description && (
                  <div>
                    <span className="text-muted-foreground">Description</span>
                    <p className="mt-1">{formValues.description}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button type="submit">
                  Publish Class
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
};

export default NewClassPage;
