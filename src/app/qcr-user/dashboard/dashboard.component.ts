import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Bank, Banks, Branch, BranchCustomer, KYCData, Branchs, KYCEntries, KYCResponse, relations, relation, Image, ImageStatus } from 'src/app/interfaces/kycdata.interface';
import { KycApiService } from 'src/app/services/kyc-api.service';
import { map, startWith } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { RejectReasonDialogComponent } from 'src/app/reject-reason-dialog/reject-reason-dialog.component';
import { ImageDialogComponent } from 'src/app/image-dialog/image-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  BankList: Bank[] = [];
  BranchList: Branch[] = [];
  BranchCustomerList: BranchCustomer[] = [];
  RelationsList: relation[] = []
  selectedBank: string = '';
  selectedBranch: string = '';
  isBranchChnage: boolean = false
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
  images: Image[] = []
  imagesStatus: ImageStatus[] = []

  myControl = new FormControl('');
  filteredOptions!: Observable<BranchCustomer[]>;
  aadhaarForm: FormGroup
  panForm: FormGroup
  accountForm!: FormGroup;

  isQcrData: boolean = true
  isChecked(key: string, status: 'ok' | 'not_ok') {
    return this.imagesStatus.find(s => s.key === key)?.status === status;
  }

  years: string[] = [];
  months: { value: string; label: string }[] = [];
  days: string[] = [];

  constructor(
    private kycApiService: KycApiService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.aadhaarForm = this.fb.group({
      aadhar_number: [''],
      name: [''],
      relation: [''],
      relation_name: [''],
      gender: [''],
      address: [''],
      dob_year: [''],
      dob_month: [''],
      dob_day: [''],
      dob: ['']
    });

    this.panForm = this.fb.group({
      pan_number: [''],
      name: [''],
      father_name: [''],
      dob_year: [''],
      dob_month: [''],
      dob_day: [''],
      form_60: [''],
      dob: ['']
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


    this.getReletions()

    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 100 }, (_, i) => `${currentYear - i}`);
    this.months = Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1).padStart(2, "0"),
      label: String(i + 1).padStart(2, "0")
    }));
    this.days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));

  }

  onDobChange() {
    const year = this.panForm.get('dob_year')?.value;
    const month = this.panForm.get('dob_month')?.value;
    const day = this.panForm.get('dob_day')?.value;

    if (year && month && day) {
      this.panForm.get('dob')?.setValue(`${year}-${month}-${day}`);
    }
  }
  onDobChangeAddhar() {
    const year = this.aadhaarForm.get('dob_year')?.value;
    const month = this.aadhaarForm.get('dob_month')?.value;
    const day = this.aadhaarForm.get('dob_day')?.value;

    if (year && month && day) {
      this.aadhaarForm.get('dob')?.setValue(`${year}-${month}-${day}`);
    }
  }
  onBranchesChnage() {
    this.isBranchChnage = true
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

    console.log(this.isBranchChnage, 'isBranchChnage');

    if (this.isBranchChnage === true) {
      this.GetBranchCustomer();
    }
    this.getOcrEntries();
  }

  getReason(key: string) {
    return this.imagesStatus.find(s => s.key === key)?.reason || '';
  }

  getStatus(key: string) {
    return this.imagesStatus.find(s => s.key === key)?.status || null;
  }

  onCheckboxChange(key: string, status: 'ok' | 'not_ok', checked: boolean) {
    if (!checked) {
      // Uncheck logic
      this.imagesStatus = this.imagesStatus.map(s =>
        s.key === key ? { ...s, status: null, reason: '' } : s
      );
      return;
    }

    if (status === 'ok') {
      // Mark as OK, clear any Not OK reason
      this.imagesStatus = this.imagesStatus.map(s =>
        s.key === key ? { ...s, status: 'ok', reason: '' } : s
      );
    } else {
      // Open dialog for Not OK reason
      const dialogRef = this.dialog.open(RejectReasonDialogComponent, {
        width: '300px',
        data: { currentIndex: this.imagesStatus.findIndex(s => s.key === key) }
      });

      dialogRef.afterClosed().subscribe((reason: any) => {
        if (reason) {
          // Mark as Not OK with reason
          this.imagesStatus = this.imagesStatus.map(s =>
            s.key === key ? { ...s, status: 'not_ok', reason } : s
          );
        } else {
          // Ensure it's unchecked if dialog is canceled
          this.imagesStatus = this.imagesStatus.map(s =>
            s.key === key ? { ...s, status: null, reason: '' } : s
          );
        }
      });
    }
  }




  getReletions() {
    const formdata = new FormData()
    formdata.append('bank_code', this.selectedBank)

    this.kycApiService.getRelation(formdata).subscribe(
      (res: relations) => {
        console.log(res);
        this.RelationsList = res.data
      }
    )
  }

  GetBranchCustomer() {
    const formData = new FormData();
    formData.append('bank_code', this.selectedBank);
    formData.append('branch_code', this.selectedBranch);

    this.kycApiService.getBranchCustomer(formData).subscribe(
      (response: { data: BranchCustomer[] }) => {
        this.BranchCustomerList = response.data;
        this.isBranchChnage = false
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
          this.images = [
            {
              url: this.ocrData.aadhar_page1_url,
              key: 'Aadhaar-1'
            },
            {
              url: this.ocrData.aadhar_page2_url,
              key: 'Aadhaar-2'
            },
            {
              url: this.ocrData.pan_page1_url,
              key: 'Pan'
            },
            {
              url: this.ocrData.sign_url,
              key: 'Sign'
            },
            {
              url: this.ocrData.selie_url,
              key: 'Selfie'
            }
          ]
          console.log(this.images)
          this.imagesStatus = this.images.map(img => ({
            status: '',
            reason: '',
            key: img.key
          }));
          this.accountForm.patchValue(data);
          this.isQcrData = true;
          try {
            const aadharJson = JSON.parse(data.aadhar_json || '{}');
            const panJson = JSON.parse(data.pan_json || '{}');


            this.aadhaarForm.patchValue(aadharJson);
            const dobValueAddhar = this.aadhaarForm.get('dob')?.value;
            if (dobValueAddhar) {
              const normalizedDob = dobValueAddhar.replace(/\//g, '-');
              const [year, month, day] = normalizedDob.split('-');
              this.aadhaarForm.patchValue({
                dob_year: year,
                dob_month: month,
                dob_day: day
              });
            }



            this.panForm.patchValue(panJson);
            // for pan dob set 
            const dobValue = this.panForm.get('dob')?.value;
            if (dobValue) {
              const normalizedDob = dobValueAddhar.replace(/\//g, '-');
              const [year, month, day] = normalizedDob.split('-');
              this.panForm.patchValue({
                dob_year: year,
                dob_month: month,
                dob_day: day
              });
            }


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
    this.onSubmit('1', 'okauuu')
  }

  showSuccess() {
    console.log('words');

  }

  onSubmit(status: string, status_remarks: string) {

    console.log(this.ocrData);
    console.log(this.imagesStatus);
    console.log(this.aadhaarForm.value);
    console.log(this.panForm.value);

    const userJson = {
      account_number: this.accountForm.get('account_number')?.value,
      cif_number: this.accountForm.get('cif_number')?.value,
      name: this.aadhaarForm.get('name')?.value,
      father_name: this.panForm.get('father_name')?.value,
      aadhar_no: this.aadhaarForm.get('aadhar_number')?.value,
      pan_no: this.panForm.get('pan_number')?.value,
      dob: this.panForm.get('dob')?.value,
      gender: this.aadhaarForm.get('gender')?.value,
      address: this.aadhaarForm.get('address')?.value
    }
    console.log(userJson);
    const formData = new FormData()
    formData.append('user_json', JSON.stringify(userJson))
    formData.append("customer_guid", this.ocrData.customer_guid)
    formData.append("gid", this.ocrData.gid)
    formData.append("bank_code", this.selectedBank)
    formData.append("aadhar_json", JSON.stringify(this.aadhaarForm.value))
    formData.append("pan_json", JSON.stringify(this.panForm.value))
    formData.append("status", status)
    formData.append("status_remarks", status_remarks)
    if (this.imagesStatus.length > 0) {
      formData.append("aadhaar_status", `${this.imagesStatus[0].status == 'ok' ? 1 : 0}`)
      formData.append("aadhaar_status_remarks", `${this.imagesStatus[0].reason}`)
      formData.append("pan_status", `${this.imagesStatus[2].status == 'ok' ? 1 : 0}`)
      formData.append("pan_status_remarks", `${this.imagesStatus[2].reason}`)
      formData.append("sign_status", `${this.imagesStatus[3].status == 'ok' ? 1 : 0}`)
      formData.append("sign_status_remarks", `${this.imagesStatus[3].reason}`)
      formData.append("selfi_status", `${this.imagesStatus[4].status == 'ok' ? 1 : 0}`)
      formData.append("selfie_status_remarks", `${this.imagesStatus[4].reason}`)

    }

    console.log(formData);


    this.kycApiService.updateOCRData(formData).subscribe(
      (res: any) => {
        console.log(res);
        if (res.status == '1') {
          alert(res.message)
          this.ocrData = {
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
        }

      }
    )

  }

  openImage(url: string, key: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl: url, imageName: key },
      disableClose: false,
      hasBackdrop: false,
      panelClass: 'floating-dialog'
    });
  }
  rejectKYCDetails() {
    const reason = prompt("Enter rejection reason:");
    if (reason && reason.trim()) {
      console.log(reason.trim());
      this.onSubmit('-3', reason.trim());
    }
  }

  holdKYCDetails() {
    const reason = prompt("Enter hold reason:");
    if (reason && reason.trim()) {
      console.log(reason.trim());
      this.onSubmit('-2', reason.trim());
    }
  }

  onForm60Change(event: Event) {
    const input = event.target as HTMLInputElement;
    this.panForm.get('form_60')?.setValue(input.checked ? 1 : 0);
  }
}