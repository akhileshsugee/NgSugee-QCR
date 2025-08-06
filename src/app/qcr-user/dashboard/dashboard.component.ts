import { Component, OnInit } from '@angular/core';
import { Bank, Banks, Branch, Branchs } from 'src/app/interfaces/kycdata.interface';
import { KycApiService } from 'src/app/services/kyc-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  BankList: Bank[] = [];
  BranchList: Branch[] = [];
  selectedBank: string = '';
  selectedBranch: string = '';

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

    // Logic to get entries based on selected branch can be added here
    console.log(`Fetching entries for branch: ${this.selectedBranch}`);
  }


  
}
