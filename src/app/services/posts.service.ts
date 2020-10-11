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
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParam = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; count: number }>(
        `http://localhost:5000/api/posts${queryParam}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(({ title, content, _id, imagePath }) => {
              return {
                title,
                content,
                id: _id,
                imagePath,
              };
            }),
            maxPosts: postData.count,
          };
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPosts.maxPosts,
        });
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

  addPost(title: string, content: string, image: File) {
    const postDate = new FormData();
    postDate.append('title', title);
    postDate.append('content', content);
    postDate.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:5000/api/posts',
        postDate
      )
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:5000/api/posts/${postId}`);
  }

  updatePost(id: string, title: string, content: string, imagePath: string) {
    const post: Post = {
      id,
      title,
      content,
      imagePath,
    };
    this.http
      .put<{ message: string }>(`http://localhost:5000/api/posts/${id}`, post)
      .subscribe(() => {
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === id);
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
