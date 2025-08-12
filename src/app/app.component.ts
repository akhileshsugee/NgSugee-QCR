import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loginUser: string = '';

  constructor(
    private router: Router,
  ) {
    const user = localStorage.getItem('authtoken');
    if (!user) {
      this.router.navigate(['login']);
    }
  }

}      
