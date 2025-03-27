import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  Validators } from '@angular/forms';
import { TableService } from '../table.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule,FormsModule,MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule,CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
    // profileForm = new FormGroup({
    //   name : new FormControl('', [Validators.required,Validators.minLength(3)]),
    //   email : new FormControl('', [Validators.required, Validators.email]),
    //   phoneNo : new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
    // });
    
    constructor(private service: UsersService, 
      private router: Router,
      private route: ActivatedRoute,
      private apiservice: TableService,
      private _snackBar: MatSnackBar) { }
    
    userId: string | null = null;
    userData: any = { name: '', email: '', phoneNo: '' };

  ngOnInit(): void {
    // Get user ID from URL
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.fetchUser();
  }

  // Fetch the user details based on the user ID
  fetchUser() {
    this.apiservice.viewUser(this.userId).subscribe((data) => {
      this.userData = data[0];  // Assuming the API returns an array, adjust if necessary
    });
  }

  // Update user details
  updateUser() {
    this.apiservice.editUser(this.userId, this.userData).subscribe(() => {
      this._snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
      this.router.navigate(['/table']); // Navigate back to the main page
    });
  }

}
