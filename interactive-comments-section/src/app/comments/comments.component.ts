import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
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
  @ViewChild('commentsContainer') commentsContainer!: ElementRef;

  comments!: Comment[];
  currentUser!: User;
  isReply = false;
  isReplying = false;

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.userService.getUser().subscribe((data: User) => {
      this.currentUser = data;
    });
    this.commentsService.getAllComments().subscribe((data: Comment[]) => {
      this.comments = data;
    });
  }

  isCurrentUser(comment: Comment) {
    return comment.user.username === this.currentUser.username;
  }

  replyComment(el?: HTMLElement, comment?: Comment) {
    this.isReplying = true;
    let replyTextBox: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(replyTextBox, 'send-comment');
    this.renderer.addClass(replyTextBox, 'send-comment--reply');
    replyTextBox.innerHTML = `
    <textarea #textToSend
          class="send-comment__textarea border"
          placeholder="Add a comment..."
          cols="30"
          rows="5"
        ></textarea>
        <div class="send-comment__footer">
          <img
            class="send-comment__img"
          />
          <button class="send-comment__btn on-hover">
            SEND
          </button>
        </div>
    `;
    this.renderer.listen(
      replyTextBox.querySelector('.send-comment__btn'),
      'click',
      (event) => {
        let replyText = <HTMLTextAreaElement>(
          event.target.parentNode.parentNode.querySelector(
            '.send-comment__textarea'
          ).value
        );
        console.log(typeof replyText);
        this.send(replyText, true, comment);
      }
    );
    this.renderer.setAttribute(
      replyTextBox.querySelector('.send-comment__img'),
      'src',
      this.currentUser.image.png
    );

    el?.insertAdjacentElement('afterend', replyTextBox);
    // console.log(this.renderer.nextSibling(el));
    // let replyTest: Node = this.renderer.nextSibling(el);
    if (!this.isReplying) {
      console.log('cai aqui');
      let container = this.renderer.parentNode(replyTextBox);
      this.renderer.removeChild(container, replyTextBox);
    }
  }

  edit() {
    console.log('editando comentario');
  }

  delete() {
    let date = new Date();
    console.log('deletando comentario');
    console.log(
      `${date.toLocaleString('en', {
        month: 'short',
      })}, ${date.getDate()}, ${date.getFullYear()}`
    );
  }

  send(
    commentText: HTMLTextAreaElement | string,
    isReply: boolean,
    comment?: Comment
  ) {
    let date = new Date();
    let today = `${date.toLocaleString('en', {
      month: 'short',
    })}, ${date.getDate()}, ${date.getFullYear()}`;
    if (isReply) {
      let replyCommentObject: Comment = {
        id: Date.now(),
        content: <string>commentText,
        createdAt: today,
        score: 0,
        replyingTo: comment?.user.username,
        user: this.currentUser,
      };
      comment?.replies?.push(replyCommentObject);
      this.commentsService.updateComment(comment!).subscribe();
      let sendCommentEl =
        this.commentsContainer.nativeElement.querySelector('.send-comment');
      sendCommentEl.parentNode.removeChild(sendCommentEl);
    } else {
      let newComment: Comment = {
        id: Date.now(),
        content: <string>commentText,
        createdAt: today,
        score: 0,
        user: this.currentUser,
        replies: [],
      };
      this.commentsService.postComment(newComment).subscribe(() => {
        this.comments.push(newComment);
      });
    }
  }

  rate(comment: Comment, mathSymbol: string, replyIndex?: number) {
    mathSymbol = mathSymbol === 'up' ? '+' : '-';
    this.isReply = replyIndex !== undefined;
    if (this.isReply) {
      comment.replies![replyIndex!].score = eval(
        comment.replies![replyIndex!].score.toString() + mathSymbol + 1
      );
    } else {
      comment.score = eval(comment.score.toString() + mathSymbol + 1);
    }
    this.commentsService.updateComment(comment).subscribe();
  }
}
