import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Comment } from './comments.model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private localUrl: string = 'http://localhost:3000/';
  private commentsUrl: string = 'comments';

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  getAllComments(): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(this.localUrl + this.commentsUrl)
      .pipe(catchError(this.handleError));
  }

  updateComment(comment: Comment) {
    return this.http
      .put<Comment>(
        this.localUrl + this.commentsUrl + '/' + comment.id,
        JSON.stringify(comment),
        this.httpOptions
      )
      .pipe(catchError(this.handleError));
  }

  postComment(comment: Comment) {
    return this.http
      .post<Comment>(this.localUrl + this.commentsUrl, comment)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
