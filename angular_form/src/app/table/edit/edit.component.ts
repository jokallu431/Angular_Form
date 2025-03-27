import { Component } from '@angular/core';
import { UsersService } from '../../users/users.service';
import { Router } from '@angular/router';
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
export class EditComponent {
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
        }
      });
    }
}
