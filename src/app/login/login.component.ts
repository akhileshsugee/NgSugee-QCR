import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private router: Router) { }
  onLogin() {
    // Logic for handling login
    console.log('Login button clicked');
    this.router.navigate(['kyc']); // Navigate to the home route after login

  }
}
