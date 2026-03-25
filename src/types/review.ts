export interface Review {
  id: string;
  userId: string;
  classId?: string;
  studioId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}
