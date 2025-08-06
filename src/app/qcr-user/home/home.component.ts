import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router

  ) { }
  userName: string = 'Mr. ABC'; // Placeholder for user name
  openProfileDialog() {
    // Example: Uncomment when ProfiledialogComponent is ready
    // this.dialog.open(ProfiledialogComponent, { disableClose: true });
  }

  onRoute(route: string) {
    console.log(route);
    if (route === 'dashboard') {
      this.router.navigate(['kyc/dashboard']);
    } if (route === 'pending') {
      this.router.navigate(['kyc/pending']);
    } else {

    }
  }

  logout() {
    console.log('Logging out...');
    // your logout logic
  }
}
