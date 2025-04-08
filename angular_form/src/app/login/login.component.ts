import { Component, inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../users/users.service';
import { Router, RouterLink } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule,
    LoadingComponent,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private snackBar = inject(MatSnackBar);
  matcher = new MyErrorStateMatcher();
  title = 'User Login';
  isLoading = false;
  passwordType = false;
  token=""
  profileForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern("^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$")])
  });

  constructor(private service: UsersService, private router: Router) { }

  @ViewChild('passwordInput') passwordInput: any;

  togglePassword() {
    this.passwordType =!this.passwordType;
  }

  handleSubmit(data: any) {
    this.isLoading = true;
    this.service.loginData(data).subscribe({
      next: (userdata:any) => {
        localStorage.setItem("tokenValue",userdata['token']);
        this.isLoading = false;
        if (!userdata) {
          this.snackBar.open("User Already Exists  ", "OK", {
            duration: 3000,
            panelClass: ['red-snackbar', 'login-snackbar'],
          });
        } else {

          this.router.navigate(['/table']);
          this.snackBar.open("User Created Successfully", "OK", {
            duration: 3000,
            panelClass: ['green-snackbar', 'login-snackbar'],
          });
        }
      },
      error: (err:any) => {
        this.isLoading = false;
        // Handle any errors that occur during the API call
        console.error("Error during user creation:", err);
        this.snackBar.open("An unexpected error occurred. Please try again.", "OK", {
          duration: 3000,
          panelClass: ['red-snackbar', 'login-snackbar'],
        });
      }

    });
  }

}
