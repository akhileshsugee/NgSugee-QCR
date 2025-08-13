import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bank, Banks, User } from 'src/app/interfaces/kycdata.interface';
import { KycApiService } from 'src/app/services/kyc-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  selectedSegment = 'excel';
  isLoading = false;

  reportForm!: FormGroup;
  banks_list: Bank[] = []
  user_list: User[] = []
  isImageDownlod: boolean = false
  isUrl: boolean = false;
  constructor(
    private fb: FormBuilder,
    private api: KycApiService,
    private userApi: UserService
  ) { }

  ngOnInit() {
    console.log(this.selectedSegment, 'se');

    this.reportForm = this.fb.group({
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      bank_code: ['', Validators.required],
      gids: ['',],
      imgUrl: ['']
    });

    this.getBanks()
  }
  getBanks() {
    this.api.getBanks().subscribe(
      (res: Banks) => {
        console.log(res.data);
        this.banks_list = res.data
      }
    )
  }

  onExcelDownload() {
    this.isLoading = true
    if (this.reportForm.valid) {
      const rawDateFrom: Date = this.reportForm.get('fromdate')?.value;
      const fromdate = rawDateFrom ? rawDateFrom.toISOString().split('T')[0] : '';

      const rawDateTo: Date = this.reportForm.get('todate')?.value;
      const todate = rawDateTo ? rawDateTo.toISOString().split('T')[0] : '';

      const bankCode = this.reportForm.get('bank_code')?.value;

      this.api.getReportExcel(bankCode, fromdate, todate).subscribe((res: Blob) => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${fromdate}_to_${todate}.xlsx`;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

      });
    }

    this.isLoading = false;
  }


  ExportImg() {
    this.isLoading = true;
    const rawDateFrom: Date = this.reportForm.get('fromdate')?.value;
    const fromdate = rawDateFrom ? rawDateFrom.toISOString().split('T')[0] : '';
    const rawDateTo: Date = this.reportForm.get('todate')?.value;
    const todate = rawDateTo ? rawDateTo.toISOString().split('T')[0] : '';
    const bankCode = this.reportForm.get('bank_code')?.value;
    const status: any = true
    const fromdata = new FormData()

    if (this.reportForm.get('gids')?.value) {
      fromdata.append('gids', this.reportForm.get('gids')?.value)
    } else {
      fromdata.append('bank_code', bankCode)
      fromdata.append('fromdate', fromdate)
      fromdata.append('todate', todate)
      fromdata.append('updatestatus', status)
    }

    this.api.getReportExportImages(fromdata).subscribe(
      (res: any) => {
        console.log(res);
        this.reportForm.get('imgUrl')?.setValue(res.Url[0])
        this.isUrl = true
        this.isLoading = false;
      }
    )
  }

  exportAsImage() {
    this.isImageDownlod = true
    return

  }




  copyToClipboard() {
    const value = this.reportForm.get('imgUrl')?.value || '';
    navigator.clipboard.writeText(value).then(() => {
      alert('Copied to clipboard!');
    });
  }

  // Download as .txt file
  downloadTxtFile() {
    const value = this.reportForm.get('imgUrl')?.value || '';
    const blob = new Blob([value], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'image-url.txt';
    a.click();

    window.URL.revokeObjectURL(url);
  }

}
