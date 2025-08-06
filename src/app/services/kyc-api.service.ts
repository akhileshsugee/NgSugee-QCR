import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Banks, Branchs } from '../interfaces/kycdata.interface';
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
}
