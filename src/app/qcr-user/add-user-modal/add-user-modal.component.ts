import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent {
  @Input() bankCode!: string;
  @Output() close = new EventEmitter<void>();

  addUserForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.addUserForm.invalid) return;

    const { name, mobile } = this.addUserForm.value;

    const formData = new FormData();
    formData.append('Name', name);
    formData.append('email', ''); // Optional or remove based on your backend
    formData.append('Mobile', mobile);
    formData.append('Password', mobile); // Default as mobile
    formData.append('role', '2');
    formData.append('status', '1');
    formData.append('bank_code', this.bankCode);

    this.loading = true;

    this.userService.addUser(formData).subscribe({
      next: (data) => {
        if (data.status === '1') {
          alert(data.message || 'User added');
          this.close.emit();
        } else {
          alert(data.message || 'Failed to add user');
        }
        this.loading = false;
      },
      error: () => {
        alert('Something went wrong');
        this.loading = false;
      }
    });
  }
}
