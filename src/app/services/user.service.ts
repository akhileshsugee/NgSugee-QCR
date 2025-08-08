import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../interfaces/kycdata.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private GET_ALL_USERS = "https://sugee.io/KYCServiceAPI/kycapi/getAllUser";
    private UPDATE_USER = "https://sugee.io/KYCServiceAPI/kycapi/UpdateUser";

    constructor(private http: HttpClient) { }

    getAllUsers(bankCode: string): Observable<any> {
        const formData = new FormData();
        formData.append('bank_code', bankCode);
        return this.http.post(this.GET_ALL_USERS, formData);
    }

    updateUser(userMobile: string, active: string, role: string, status: string): Observable<any> {
        const formData = new FormData();
        formData.append('Mobile', userMobile);
        formData.append('Password', userMobile);
        formData.append('active', active);
        formData.append('role', role);
        formData.append('status', status);
        return this.http.post(this.UPDATE_USER, formData);
    }
    addUser(formData: FormData): Observable<any> {
        return this.http.post("", formData);
    }
}
