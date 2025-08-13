import { Component } from '@angular/core';
import { Member } from 'src/app/interfaces/kycdata.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  members: Member[] = [];
  allMembers: Member[] = [];
  searchValue = '';
  loading = false;
  isModalOpen = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers('162').subscribe({
      next: (res) => {
        if (res.status === '1') {
          this.members = res.data;
          this.allMembers = res.data;
        } else {
          this.members = [];
          this.allMembers = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.members = [];
        this.loading = false;
      }
    });
  }

  onSearch(value: string): void {
    this.searchValue = value;
    this.members = this.allMembers.filter(member =>
      member.name.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  handleToggle(user: Member): void {
    const newActive = user.active === '1' ? '0' : '1';
    const newStatus = newActive;

    this.userService.updateUser(user.mobile, newActive, user.role, newStatus).subscribe({
      next: (data) => {
        if (data.status === '1') {
          user.active = newActive;
          alert(data.message)
        } else {
          alert(data.message)
        }
      },
      error: () => alert('Failed to update user')
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
