import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Banks, Branch, BranchCustomer, BranchCustomers, Branchs } from 'src/app/interfaces/kycdata.interface';
import { KycApiService } from 'src/app/services/kyc-api.service';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  BankList: Bank[] = [];
  BranchList: Branch[] = [];
  BranchCustomerList: BranchCustomer[] = [];
  selectedBank: string = '';
  selectedBranch: string = '';


  myControl = new FormControl('');
  filteredOptions!: Observable<BranchCustomer[]>;

  constructor(private kycApiService: KycApiService) { }

  ngOnInit(): void {
    this.kycApiService.getBanks().subscribe(
      (response: Banks) => {
        this.BankList = response.data;
      },
      error => {
        console.error('Error loading banks:', error);
      }
    );

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  getBranches() {
    if (!this.selectedBank) {
      console.warn('No bank code selected');
      return;
    }

    const formData = new FormData();
    formData.append('bank_code', this.selectedBank);

    this.kycApiService.getBranches(formData).subscribe(
      (res: Branchs) => {
        this.BranchList = res.data;
      },
      error => {
        console.error('Error loading branches:', error);
      }
    );
  }

  getEntries() {
    if (!this.selectedBranch) {
      console.warn('No branch code selected');
      return;
    }
    this.GetBranchCustomer();
  }

  GetBranchCustomer() {
    const formData = new FormData();
    formData.append('bank_code', this.selectedBank);
    formData.append('branch_code', this.selectedBranch);

    this.kycApiService.getBranchCustomer(formData).subscribe(
      (response: { data: BranchCustomer[] }) => {
        this.BranchCustomerList = response.data;
        console.log('Branch Customer Data:', this.BranchCustomerList);
      }
    );
  }


  private _filter(value: string): BranchCustomer[] {
    const filterValue = value.toLowerCase();

    return this.BranchCustomerList.filter(option =>
      option.account_number.toLowerCase().includes(filterValue) ||
      option.cif_number.toLowerCase().includes(filterValue)
    );
  }


  years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  months = [
    { value: '01', name: 'January' },
    { value: '02', name: 'February' },
    { value: '03', name: 'March' },
    { value: '04', name: 'April' },
    { value: '05', name: 'May' },
    { value: '06', name: 'June' },
    { value: '07', name: 'July' },
    { value: '08', name: 'August' },
    { value: '09', name: 'September' },
    { value: '10', name: 'October' },
    { value: '11', name: 'November' },
    { value: '12', name: 'December' },
  ];
  days = Array.from({ length: 31 }, (_, i) => i + 1);

}
