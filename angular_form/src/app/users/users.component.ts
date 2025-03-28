
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
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule,FormsModule,MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule,CommonModule,MatSnackBarModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  title = 'Create User';
  private _snackBar = inject(MatSnackBar);
  matcher = new MyErrorStateMatcher();
  profileForm = new FormGroup({
    name : new FormControl('', [Validators.required,Validators.minLength(3)]),
    email : new FormControl('', [Validators.required, Validators.email]),
    phoneNo : new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
  });
  
  constructor(private service: UsersService, private router: Router) { }
  handleSubmit(data: any) {
    console.log("data", data);
    this.service.postData(data).subscribe(() => {
      console.log("result", data);
      if (data) {
        
        // [routerLink]="['/table']" routerLinkActive="router-link-active" 
        this.router.navigate(['/table']);
         this._snackBar.open('User Created','close',{
          duration: 3000
        });
        // snackBarRef.dismiss();
      }
    });
  }
  
}
