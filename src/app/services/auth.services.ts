// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface UserCred {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private TOKEN_KEY = 'authtoken';
    private ROLE_KEY = 'role';

    private LOGIN_URL = "https://sugee.io/KYCServiceAPI/oauth/token"; // Update as needed

    public loading$ = new BehaviorSubject<boolean>(false);
    public loggedIn$ = new BehaviorSubject<boolean>(false);
    public userName$ = new BehaviorSubject<string>('');
    public isAdmin$ = new BehaviorSubject<boolean>(false);

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {
        this.initializeAuth();
    }

    private initializeAuth() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        const role = localStorage.getItem(this.ROLE_KEY);

        if (token) {
            this.loggedIn$.next(true);
            this.isAdmin$.next(role === '1');
        } else {
            this.loggedIn$.next(false);
            this.isAdmin$.next(false);
        }
    }

    login(cred: UserCred) {
        this.loading$.next(true);

        const formData = new FormData();
        formData.append('Username', cred.email);
        formData.append('Password', cred.password);

        this.http.post<any>(this.LOGIN_URL, formData).subscribe({
            next: (data) => {
                if (data.token) {
                    localStorage.setItem(this.TOKEN_KEY, `Bearer ${data.token}`);
                    localStorage.setItem(this.ROLE_KEY, data.role);

                    this.userName$.next(data.username || cred.email);
                    this.loggedIn$.next(true);
                    this.isAdmin$.next(data.role === '1');

                    if (data.role === '1') {
                        this.router.navigate(['/admin']);
                    }
                    else if (data.role === '2') {
                        this.router.navigate(['kyc/dashboard']);
                    }
                    else {
                        alert(data.message || 'Unable to login');
                    }
                } else {
                    alert(data.message || 'Invalid credentials');
                }
            },
            error: () => {
                alert('Something went wrong');
            },
            complete: () => {
                this.loading$.next(false);
            }
        });
    }


    logout() {
        localStorage.clear();
        sessionStorage.clear();
        this.loggedIn$.next(false);
        this.userName$.next('');
        this.isAdmin$.next(false);

        this.router.navigate(['']);
    }
}
