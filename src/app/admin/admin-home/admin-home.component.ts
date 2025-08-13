import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.services';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent {
  @ViewChild('sidebar') sidebar!: MatSidenav;

  sidenavMode: 'side' | 'over' = 'side';
  isSmallScreen = false;
  isSidebarOpened = true;
  userName = 'Admin';
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private observer: BreakpointObserver,
    private authService: AuthService
  ) { }
  isAdmin = this.authService.isAdmin$
  ngOnInit(): void {
    this.observer.observe(['(max-width: 920px)']).subscribe(result => {
      this.isSmallScreen = result.matches;
      this.sidenavMode = this.isSmallScreen ? 'over' : 'side';
      this.isSidebarOpened = !this.isSmallScreen;
    });
  }
  openProfileDialog() {
    // Example: Uncomment when ProfiledialogComponent is ready
    // this.dialog.open(ProfiledialogComponent, { disableClose: true });
  }

  onRoute(route: string) {
    console.log(route);
    if (route === 'dashboard') {
      this.router.navigate(['kyc/dashboard']);
    } else if (route === 'pending') {
      this.router.navigate(['kyc/pending']);
    } else if (route === 'userManagement') {
      this.router.navigate(['kyc/userManagement'])
    }
  }
  logout() {
    this.authService.logout()
  }
}
