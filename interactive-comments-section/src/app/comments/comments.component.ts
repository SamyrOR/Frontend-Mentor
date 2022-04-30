import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subscription, take } from 'rxjs';
import { ModalService } from '../shared/modal/modal.service';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
import { Comment } from './comments.model';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {
  @ViewChild('commentsContainer') commentsContainer!: ElementRef;
  @ViewChild('sendCommentText') sendCommentText!: ElementRef;
  @ViewChild('commentsRef', { read: ViewContainerRef })
  commentsView!: ViewContainerRef;
  comments!: Comment[];
  currentUser!: User;
  isReply = false;
  isReplying = false;
  sub!: Subscription;
  modalTile: string = 'Delete comment';
  modalBody: string =
    'Are you sure you wat to delete this comment? This will remove the comment and can`t be undone.';

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
    private renderer: Renderer2,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.userService
      .getUser()
      .pipe(take(1))
      .subscribe((data: User) => {
        this.currentUser = data;
      });
    this.commentsService
      .getAllComments()
      .pipe(take(1))
      .subscribe((data: Comment[]) => {
        this.comments = data;
      });
  }

  isCurrentUser(comment: Comment) {
    return comment.user.username === this.currentUser.username;
  }

  replyComment(el: HTMLElement, comment: Comment) {
    if (this.isReplying) {
      this.removeReplyBox();
    } else {
      this.isReplying = true;
      let replyTextBox: HTMLElement = this.createTextBox('REPLY');
      this.renderer.listen(
        replyTextBox.querySelector('.send-comment__btn'),
        'click',
        (event) => {
          let replyText = <HTMLTextAreaElement>(
            event.target.parentNode.parentNode.querySelector(
              '.send-comment__textarea'
            ).value
          );
          this.send(replyText, true, comment);
        }
      );
      this.setPhotoAtElement(replyTextBox);
      el.insertAdjacentElement('afterend', replyTextBox);
    }
  }

  edit(commentEl: HTMLElement, comment: Comment, isReply: boolean) {
    let text: string = comment.content;
    let textBox: HTMLElement = this.createTextBox('UPDATE');
    this.renderer.selectRootElement(textBox.firstElementChild, true).value =
      text;
    this.setPhotoAtElement(textBox);
    commentEl.insertAdjacentElement('afterend', textBox);
    this.renderer.setStyle(commentEl, 'display', 'none');
    this.renderer.listen(
      textBox.querySelector('.send-comment__btn'),
      'click',
      (event) => {
        let newText = event.target.parentNode.parentNode.querySelector(
          '.send-comment__textarea'
        ).value;
        if (isReply) {
          this.findReplyComment(comment, this.editAct.bind(this), newText);
        } else {
          comment.content = newText;
          this.commentsService.updateComment(comment).pipe(take(1)).subscribe();
        }
        this.renderer.setStyle(commentEl, 'display', 'block');
        this.renderer.removeChild(textBox.parentElement, textBox);
      }
    );
  }

  delete(isReply: boolean, commentToAct: Comment) {
    this.sub = this.modalService
      .openModal(this.commentsView, this.modalTile, this.modalBody)
      .subscribe((modalResponse) => {
        if (modalResponse === 'confirm') {
          if (!isReply) {
            this.commentsService
              .deleteComment(commentToAct.id)
              .pipe(take(1))
              .subscribe((response) => {
                this.comments = this.comments.filter((comment, index) => {
                  return comment.id !== commentToAct.id;
                });
              });
          } else {
            this.findReplyComment(commentToAct, this.deleteAct.bind(this));
          }
        }
      });
  }

  editAct(comment: Comment, reply: Comment, newText: string) {
    if (comment.replies) {
      let indexOfReply = comment.replies?.indexOf(reply);
      comment.replies[indexOfReply].content = newText;
    }
    this.commentsService.updateComment(comment).pipe(take(1)).subscribe();
  }

  deleteAct(comment: Comment, reply: Comment) {
    let indexOfReply = comment.replies?.indexOf(reply);
    comment.replies?.splice(indexOfReply!, 1);
    this.commentsService.updateComment(comment).pipe(take(1)).subscribe();
  }

  replyAct(comment: Comment, replyCommentObject: Comment) {
    comment.replies?.push(replyCommentObject);
    this.commentsService.updateComment(comment).pipe(take(1)).subscribe();
  }

  removeReplyBox() {
    let sendCommentEl =
      this.commentsContainer.nativeElement.querySelector('.send-comment');
    this.renderer.removeChild(sendCommentEl.parentNode, sendCommentEl);
    this.isReplying = false;
  }

  send(
    commentText: HTMLTextAreaElement | string,
    isReply: boolean,
    commentReply?: Comment
  ) {
    let date = new Date();
    let today = `${date.toLocaleString('en', {
      month: 'short',
    })}, ${date.getDate()}, ${date.getFullYear()}`;
    if (isReply && commentReply) {
      let replyCommentObject: Comment = {
        id: Date.now(),
        content: <string>commentText,
        createdAt: today,
        score: 0,
        replyingTo: commentReply.user.username,
        user: this.currentUser,
      };
      if (!commentReply.replies) {
        this.findReplyComment(commentReply, (comment: Comment) => {
          this.replyAct(comment, replyCommentObject);
        });
      } else {
        this.replyAct(commentReply, replyCommentObject);
      }
      this.removeReplyBox();
    }
    if (!isReply) {
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
      this.sendCommentText.nativeElement.value = '';
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

  findReplyComment(
    commentToAct: Comment,
    functionToExec: Function,
    text?: string
  ) {
    for (let comment of this.comments) {
      if (comment.replies) {
        for (let reply of comment.replies) {
          if (reply.id === commentToAct.id) {
            functionToExec(comment, reply, text);
          }
        }
      }
    }
  }

  createTextBox(btnText: string): HTMLElement {
    let textBox = this.renderer.createElement('div');
    this.renderer.addClass(textBox, 'send-comment');
    this.renderer.addClass(textBox, 'send-comment--reply');
    textBox.innerHTML = `
    <textarea #textToSend
          class="send-comment__textarea border"
          placeholder="Add a comment..."
          cols="30"
          rows="5"
        >
    </textarea>
    <div class="send-comment__footer">
      <img
        class="send-comment__img"
      />
      <button class="send-comment__btn on-hover">
        ${btnText}
      </button>
    </div>
    `;
    return textBox;
  }

  setPhotoAtElement(textBox: HTMLElement) {
    this.renderer.setAttribute(
      textBox.querySelector('.send-comment__img'),
      'src',
      this.currentUser.image.png
    );
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
