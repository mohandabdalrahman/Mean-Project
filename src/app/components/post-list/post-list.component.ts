import { PostsService } from './../../services/posts.service';
import { Post } from './../../models/post.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  constructor(private postServices: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postServices.getPosts();
    this.postsSub = this.postServices
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onDeletePost(postId: string) {
    this.postServices.deletePost(postId);
  }
}
