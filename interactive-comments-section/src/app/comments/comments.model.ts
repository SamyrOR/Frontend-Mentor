import { User } from '../shared/models/user.model';

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo?: string;
  user: User;
  replies: Comment[];
}
