import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banks, BranchCustomers, Branchs, ExportResponse, KYCEntries, KYCResponse, relations, Remark } from '../interfaces/kycdata.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KycApiService {

  constructor(
    private http: HttpClient
  ) { }

  BaseUrl = 'https://sugee.io/KYCServiceAPI/kycapi/';

  getBanks(): Observable<Banks> {
    return this.http.post<Banks>(this.BaseUrl + 'getBanks', null);
  }

  getBranches(data: any): Observable<Branchs> {
    return this.http.post<Branchs>(this.BaseUrl + 'getBranches', data);
  }

  getBranchCustomer(data: any): Observable<BranchCustomers> {
    return this.http.post<BranchCustomers>(this.BaseUrl + 'getBranchCustomers', data);
  }

  getOcrData(data: any): Observable<KYCResponse> {
    return this.http.post<KYCResponse>(this.BaseUrl + 'getOCRData', data);
  }

  getRelation(data: any): Observable<relations> {
    return this.http.post<relations>(this.BaseUrl + 'getRelationList', data);
  }
  updateOCRData(data: any): Observable<any> {
    return this.http.post<any>(this.BaseUrl + 'updateOCRData', data);
  }
  getRemarks(data: any): Observable<any> {
    return this.http.post<Remark[]>(this.BaseUrl + 'getQCRemarks', data)
  }

  getReportExportImages(data: any): Observable<ExportResponse> {
    return this.http.post<ExportResponse>(this.BaseUrl + 'exportImages', data)
  }

  getReportExcel(bankCode: string, fromDate: string, toDate: string): Observable<Blob> {
    const url = `${this.BaseUrl}getXLSData?bank_code=${bankCode}&fromdate=${fromDate}&todate=${toDate}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
