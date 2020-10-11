import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading = false;
  constructor(private userService: UserService) {}

  ngOnInit(): void {}
  onLogin(formData: NgForm) {
    if (formData.invalid) return;
    this.userService.login(formData.value);
  }
}
