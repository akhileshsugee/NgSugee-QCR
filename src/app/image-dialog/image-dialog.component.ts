import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {
  zoomLevel = 1;
  lensVisible = false;
  lensX = 0;
  lensY = 0;
  bgWidth = 0;
  bgHeight = 0;
  bgPosX = 0;
  bgPosY = 0;

  @ViewChild('imageRef') imageRef!: ElementRef<HTMLImageElement>;

  constructor(
    public dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  zoomIn() {
    this.zoomLevel += 0.1;
  }

  zoomOut() {
    this.zoomLevel = Math.max(0.1, this.zoomLevel - 0.1);
  }

  showLens() {
    this.lensVisible = true;
  }

  hideLens() {
    this.lensVisible = false;
  }

  moveLens(event: MouseEvent) {
    const img = this.imageRef.nativeElement;
    const rect = img.getBoundingClientRect();

    const lensSize = 100;
    let x = event.clientX - rect.left - lensSize / 2;
    let y = event.clientY - rect.top - lensSize / 2;

    // Clamp lens within image
    x = Math.max(0, Math.min(x, rect.width - lensSize));
    y = Math.max(0, Math.min(y, rect.height - lensSize));

    this.lensX = x;
    this.lensY = y;

    // Background image zoom
    const zoomFactor = 2;
    this.bgWidth = rect.width * zoomFactor;
    this.bgHeight = rect.height * zoomFactor;
    this.bgPosX = -x * zoomFactor;
    this.bgPosY = -y * zoomFactor;
  }

}


