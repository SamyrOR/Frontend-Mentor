import { Component, OnInit } from '@angular/core';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import { Comment } from './comments.model';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {
  comments!: Comment[];
  currentUser!: User;
  constructor(
    private commentsService: CommentsService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((data: User) => {
      this.currentUser = data;
      console.log(this.currentUser);
    });
    this.commentsService.getAllComments().subscribe((data: Comment[]) => {
      this.comments = data;
    });
  }

  isCurrentUser(comment: Comment) {
    return comment.user.username === this.currentUser.username;
  }
}
