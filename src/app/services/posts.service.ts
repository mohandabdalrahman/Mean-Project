import { Post } from './../models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:5000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map(({ title, content, _id }) => {
            return {
              title,
              content,
              id: _id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ post: Post; message: string }>(
      `http://localhost:5000/api/posts/${id}`
    );
  }

  addPost(title: string, content: string) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:5000/api/posts',
        {
          id: null,
          title,
          content,
        }
      )
      .subscribe((resData) => {
        console.log(resData.message);
        this.posts.push({ id: resData.postId, title, content });
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/'])
      });
  }

  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:5000/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id,
      title,
      content,
    };
    this.http
      .put<{ message: string }>(`http://localhost:5000/api/posts/${id}`, post)
      .subscribe(() => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
