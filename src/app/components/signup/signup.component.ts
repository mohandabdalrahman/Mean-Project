import { UserService } from './../../services/user.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private userService: UserService) {}
  isLoading = false;
  ngOnInit(): void {}
  onSignUp(formData: NgForm) {
    if (formData.invalid) {
      return;
    }
    this.isLoading = true;
    this.userService.signUp(formData.value);
  }
}
