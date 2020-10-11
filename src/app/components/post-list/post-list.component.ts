import { UserService } from './../../services/user.service';
import { PostsService } from './../../services/posts.service';
import { Post } from './../../models/post.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5];
  isUserAuth: boolean = false;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private postServices: PostsService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postServices.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postServices
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.isUserAuth = this.userService.getIsAuth();
    this.authStatusSub = this.userService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isUserAuth = isAuth;
      });
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onDeletePost(postId: string) {
    this.isLoading = true;
    this.postServices.deletePost(postId).subscribe(() => {
      this.postServices.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  onPageChange(pageDate: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageDate.pageIndex + 1;
    this.postsPerPage = pageDate.pageSize;
    this.postServices.getPosts(this.postsPerPage, this.currentPage);
  }
}
