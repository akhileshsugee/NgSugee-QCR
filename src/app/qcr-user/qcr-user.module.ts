import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QcrUserRoutingModule } from './qcr-user-routing.module';
import { HomeComponent } from './home/home.component';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PendingUserComponent } from './pending-user/pending-user.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { MatExpansionModule } from '@angular/material/expansion';
import { UserManagementComponent } from './userMangement/userManagement.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { MatCheckboxModule } from "@angular/material/checkbox";


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    PendingUserComponent,
    UserManagementComponent,
    AddUserModalComponent
  ],
  imports: [
    CommonModule,
    QcrUserRoutingModule,
    MatButtonModule,
    MatSidenavModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatIconModule,
  ]
})
export class QcrUserModule { }
