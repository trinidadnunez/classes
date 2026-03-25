'use client';

import { Building2, CheckCircle, XCircle, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMockData } from '@/providers/MockDataProvider';
import { MOCK_STUDIOS } from '@/lib/mock-data/studios';
import { MOCK_CLASSES } from '@/lib/mock-data/classes';

const MOCK_FLAGGED_ITEMS = [
  { id: 'flag-1', type: 'Review', description: 'Inappropriate language in review for "Vinyasa Flow"', severity: 'medium' },
  { id: 'flag-2', type: 'Studio', description: 'Estudio Nuevo may have misleading facility claims', severity: 'low' },
  { id: 'flag-3', type: 'Class', description: 'Reported pricing inconsistency for "Reformer Pilates"', severity: 'high' },
];

const SEVERITY_COLORS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const AdminPage = () => {
  const { currentRole, updateStudioStatus, studioStatuses, bookings, sessions } = useMockData();

  if (currentRole !== 'admin') {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Admin Portal</h1>
        <p className="mt-2 text-muted-foreground">
          Switch to &quot;Platform Admin&quot; role to access this page.
        </p>
      </div>
    );
  }

  const studios = MOCK_STUDIOS.map((s) => ({
    ...s,
    status: studioStatuses[s.id] ?? s.status,
  }));

  const pendingStudios = studios.filter((s) => s.status === 'pending');
  const approvedStudios = studios.filter((s) => s.status === 'approved');
  const totalBookings = bookings.filter((b) => b.status === 'confirmed').length;
  const totalSessions = sessions.filter((s) => s.status === 'scheduled').length;

  const handleApprove = (studioId: string) => {
    updateStudioStatus(studioId, 'approved');
    toast.success('Studio approved and now visible in search.');
  };

  const handleDecline = (studioId: string) => {
    updateStudioStatus(studioId, 'disabled');
    toast.success('Studio declined.');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedStudios.length}</p>
              <p className="text-xs text-muted-foreground">Active Studios</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingStudios.length}</p>
              <p className="text-xs text-muted-foreground">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Users className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalBookings}</p>
              <p className="text-xs text-muted-foreground">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{MOCK_CLASSES.length}</p>
              <p className="text-xs text-muted-foreground">Total Classes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Pending Studio Approvals ({pendingStudios.length})
            </h2>
            {pendingStudios.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No studios pending approval.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingStudios.map((studio) => (
                  <Card key={studio.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 min-w-0 flex-1">
                          <h3 className="font-semibold">{studio.name}</h3>
                          <p className="text-sm text-muted-foreground">{studio.address}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {studio.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {studio.facilities.slice(0, 4).map((f) => (
                              <Badge key={f} variant="secondary" className="text-xs">
                                {f}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button size="sm" onClick={() => handleApprove(studio.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger
                              className="inline-flex items-center gap-1 rounded-lg border border-input bg-transparent px-2.5 h-7 text-xs font-medium text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4" />
                              Decline
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Decline Studio</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to decline &quot;{studio.name}&quot;? They will be
                                  notified of this decision.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  variant="destructive"
                                  onClick={() => handleDecline(studio.id)}
                                >
                                  Confirm Decline
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h2 className="text-lg font-semibold mb-4">All Studios</h2>
            <div className="space-y-2">
              {studios.map((studio) => (
                <div key={studio.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{studio.name}</p>
                    <p className="text-xs text-muted-foreground">{studio.address}</p>
                  </div>
                  <Badge
                    variant={
                      studio.status === 'approved' ? 'default' :
                      studio.status === 'pending' ? 'secondary' : 'outline'
                    }
                  >
                    {studio.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Content Moderation</h3>
              <div className="space-y-3">
                {MOCK_FLAGGED_ITEMS.map((item) => (
                  <div key={item.id} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[item.severity]}`}>
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <div className="flex gap-2">
                      <Button
                        size="xs"
                        variant="outline"
                        className="text-xs"
                        onClick={() => toast.success('Item dismissed.')}
                      >
                        Dismiss
                      </Button>
                      <Button
                        size="xs"
                        variant="destructive"
                        className="text-xs"
                        onClick={() => toast.success('Item removed.')}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                System Health
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active sessions</span>
                  <span className="font-medium">{totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Booking failure rate</span>
                  <span className="font-medium text-green-600">0.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg page load</span>
                  <span className="font-medium text-green-600">1.8s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API latency (p50)</span>
                  <span className="font-medium text-green-600">120ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capacity utilization</span>
                  <span className="font-medium">67%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
