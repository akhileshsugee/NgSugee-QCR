import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Bank, Banks } from 'src/app/interfaces/kycdata.interface';
import { KycApiService } from 'src/app/services/kyc-api.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  reportForm!: FormGroup;
  banks_list: Bank[] = []

  constructor(
    private fb: FormBuilder,
    private api: KycApiService
  ) { }

  ngOnInit() {
    this.reportForm = this.fb.group({
      fromdate: ['', Validators.required],
      todate: ['', Validators.required],
      bank_code: ['', Validators.required]
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

  generateReport() {
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
  }


  exportAsImage() {
    console.log('Exporting as image...');
    // Logic to export chart/table as image (e.g., html2canvas)
  }
}
