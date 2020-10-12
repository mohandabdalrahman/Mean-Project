import { Post } from './../models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
const BACKEND_URL = `${environment.apiUrl}/posts`;
@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postPerPage: number, currentPage: number) {
    const queryParam = `?pageSize=${postPerPage}&currentPage=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; count: number }>(
        `${BACKEND_URL}${queryParam}`
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map(
              ({ title, content, _id, imagePath, creator }) => {
                return {
                  title,
                  content,
                  id: _id,
                  imagePath,
                  creator,
                };
              }
            ),
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
      `${BACKEND_URL}/${id}`
    );
  }

  addPost(title: string, content: string, image: File) {
    const postDate = new FormData();
    postDate.append('title', title);
    postDate.append('content', content);
    postDate.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(BACKEND_URL, postDate)
      .subscribe((resData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete(`${BACKEND_URL}/${postId}`);
  }

  updatePost(id: string, title: string, content: string, imagePath: string) {
    const post: Post = {
      id,
      title,
      content,
      imagePath,
      creator: null,
    };
    this.http
      .put<{ message: string }>(`${BACKEND_URL}/${id}`, post)
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
