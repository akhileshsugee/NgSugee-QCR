import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'kyc', loadChildren: () => import('./qcr-user/qcr-user.module').then(q => q.QcrUserModule) },

  // Redirect empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Wildcard route (for 404 or undefined paths)
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
