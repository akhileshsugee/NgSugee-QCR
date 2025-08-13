import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { ReportComponent } from './report/report.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { PendingUserComponent } from './pending-user/pending-user.component';

const routes: Routes = [
  {
    path: '', component: AdminHomeComponent, children: [
      { path: '', component: UserManagementComponent },
      { path: 'user', component: UserManagementComponent },
      { path: 'report', component: ReportComponent },
      { path: 'pending', component: PendingUserComponent }

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
