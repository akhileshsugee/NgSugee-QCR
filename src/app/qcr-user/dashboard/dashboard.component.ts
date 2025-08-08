import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Banks, Branch, BranchCustomer, KYCData, Branchs, KYCEntries, KYCResponse } from 'src/app/interfaces/kycdata.interface';
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
  ocrData: KYCData = {
    gid: '',
    bank_code: '',
    branch_code: '',
    account_number: '',
    cif_number: '',
    customer_guid: '',
    aadhar_page1_path: '',
    aadhar_page1_url: '',
    aadhar_page2_path: '',
    aadhar_page2_url: '',
    pan_page1_path: '',
    pan_page1_url: '',
    selie_path: '',
    selie_url: '',
    sign_path: '',
    sign_url: '',
    status: '',
    created_on: '',
    aadhar_json: '',
    pan_json: '',
    user_json: '',
    status_remarks: '',
    selfie_status: '',
    selfie_status_remarks: '',
    sign_status: '',
    sign_status_remarks: '',
    aadhaar_status: '',
    aadhaar_status_remarks: '',
    pan_status: '',
    pan_status_remarks: ''
  }

  myControl = new FormControl('');
  filteredOptions!: Observable<BranchCustomer[]>;
  aadhaarForm: FormGroup
  panForm: FormGroup
  accountForm!: FormGroup;

  isQcrData: boolean = false
  constructor(
    private kycApiService: KycApiService,
    private fb: FormBuilder
  ) {
    this.aadhaarForm = this.fb.group({
      aadhaarNumber: [''],
      name: [''],
      relation: [''],
      relationName: [''],
      gender: [''],
      address: [''],
      year: [''],
      month: [''],
      day: ['']
    });

    this.panForm = this.fb.group({
      panNumber: [''],
      name: [''],
      fatherName: [''],
      year: [''],
      month: [''],
      day: ['']
    });


    this.accountForm = this.fb.group({
      account_number: [''],
      cif_number: ['']
    });


  }

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
    // this.GetBranchCustomer();
    this.getOcrEntries();
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


  getOcrEntries() {
    const formData = new FormData();
    formData.append('bank_code', this.selectedBank);
    formData.append('branch_code', this.selectedBranch);
    formData.append('limit', '1');
    formData.append('status', '0');

    this.kycApiService.getOcrData(formData).subscribe({
      next: (res: KYCResponse) => {
        if (res.status === '1' && res.data?.length > 0) {
          const data = res.data[0];

          this.ocrData = data;
          this.accountForm.patchValue(data);
          this.isQcrData = true;

          try {
            const aadharJson = JSON.parse(data.aadhar_json || '{}');
            const panJson = JSON.parse(data.pan_json || '{}');

            this.aadhaarForm.patchValue(aadharJson);
            this.panForm.patchValue(panJson);
          } catch (error) {
            console.error('JSON parsing error:', error);
          }

          const updateFormData = new FormData();
          updateFormData.append('bank_code', this.selectedBank);
          updateFormData.append('gid', data.gid);
          updateFormData.append('customer_guid', data.customer_guid);
          updateFormData.append('status', '-1');
          updateFormData.append('aadhar_json', '');

          this.kycApiService.updateOCRData(updateFormData).subscribe({
            next: () => {
              console.log('Status updated to -1 successfully.');
            },
            error: (err: any) => {
              console.error('Failed to update status:', err);
            }
          });
        } else {
          console.warn('No OCR entries found or status !== 1');
        }
      },
      error: (err) => {
        console.error('Error fetching OCR data:', err);
      }
    });
  }

  approveKYCDetails() {
  }
  rejectKYCDetails() {
  }

  holdKYCDetails() { }
}