import { Subscription } from 'rxjs';
import { UserService } from './../../services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  isUserAuth: boolean = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.authListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe((isAuth) => {
        this.isUserAuth = isAuth;
      });
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
