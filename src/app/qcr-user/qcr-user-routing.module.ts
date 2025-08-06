import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingUserComponent } from './pending-user/pending-user.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pending', component: PendingUserComponent }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QcrUserRoutingModule { }
