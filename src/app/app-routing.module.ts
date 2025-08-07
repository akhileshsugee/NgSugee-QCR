import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
// import { DashboardComponent } from './qcr-user/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: AuthPageComponent },
  { path: 'kyc', loadChildren: () => import('./qcr-user/qcr-user.module').then(q => q.QcrUserModule) },
  // {path : 'dashboard' , component : DashboardComponent},

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
