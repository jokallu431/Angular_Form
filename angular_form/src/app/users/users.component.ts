
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UsersService } from './users.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { TableService } from '../table/table.service';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { LoadingComponent } from '../loading/loading.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule,
            FormsModule,
            MatButtonModule, 
            MatDividerModule, 
            MatIconModule, 
            MatFormFieldModule, 
            MatInputModule,
            CommonModule,
            MatSnackBarModule,
            MatProgressSpinnerModule,
            LoadingComponent,
            RouterLink
          ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  title = 'Create User';
  isLoading = false;
  private snackBar = inject(MatSnackBar);
  matcher = new MyErrorStateMatcher();
  passwordType = false;
  profileForm = new FormGroup({
    name : new FormControl('', [Validators.required,Validators.minLength(3),Validators.pattern('^[a-zA-Z ]*$')]),
    email : new FormControl('', [Validators.required, Validators.email]),
    phoneNo : new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    password : new FormControl('', [Validators.required,Validators.pattern("^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$")])
  });
  
  constructor(private service: UsersService, private router: Router) { }
  togglePassword() {
    this.passwordType =!this.passwordType;
  }
  handleSubmit(data: any) {
    this.isLoading = true;
    this.service.postData(data).subscribe({

      next: (userdata) => {
        this.isLoading = false;
      if (userdata===null) {
          this.snackBar.open("User Already Exists  ", "OK", {
          duration: 3000,
          panelClass: ['red-snackbar', 'login-snackbar'],
           });
      }else{
            this.router.navigate(['']);
            this.snackBar.open("User Created Successfully", "OK", {
            duration: 3000,
            panelClass: ['green-snackbar', 'login-snackbar'],
           });
      }
    },
    error: (err) => {
      this.isLoading = false;
        // Handle any errors that occur during the API call
        console.error("Error during user creation:", err);
        this.snackBar.open(err.error?.message || "An unexpected error occurred. Please try again.", "OK", {
            duration: 3000,
            panelClass: ['red-snackbar', 'login-snackbar'],
        });
    }

    });
  }
}
