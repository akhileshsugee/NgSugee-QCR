import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KycApiService } from '../services/kyc-api.service';
import { Remark } from '../interfaces/kycdata.interface';

@Component({
  selector: 'app-reject-reason-dialog',
  templateUrl: './reject-reason-dialog.component.html',
  styleUrls: ['./reject-reason-dialog.component.scss']
})
export class RejectReasonDialogComponent {
  reason: string = '';
  showReasonPopup = true;
  currentIndex = 0;
  remarks: Remark[] = [];
  imageStatuses: { reason: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<RejectReasonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private kycService: KycApiService,
  ) {
    this.currentIndex = data?.currentIndex ?? 0;
    this.loadRemarks();
  }

  loadRemarks() {
    const formData = new FormData();
    formData.append('bank_code', '162');

    this.kycService.getRemarks(formData).subscribe((response: any) => {
      this.remarks = response.data || [];
      this.imageStatuses = this.remarks.map(() => ({ reason: '' }));
      if (this.imageStatuses.length <= this.currentIndex) {
        this.imageStatuses.push({ reason: '' });
      }
    });
  }


  changeReason(index: number) {
    if (this.remarks[index]) {
      this.reason = this.remarks[index].remarks;
    }
  }

  setShowReasonPopup(value: boolean) {
    this.showReasonPopup = value;
    this.close(false);
  }

  handleReasonSubmit(reason: string) {
    console.log('Selected Reason:', reason);
    this.setShowReasonPopup(false);
  }

  handleSave(reason: string, save: boolean) {
    this.handleReasonSubmit(reason);
    this.close(save);
  }

  close(save: boolean) {
    if (save && this.imageStatuses[this.currentIndex]) {
      this.dialogRef.close(this.imageStatuses[this.currentIndex]?.reason);
    } else {
      this.dialogRef.close(null);
    }
  }
}
