import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../users/users.service';
import {FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
  Validators} from '@angular/forms';
import { MyErrorStateMatcher } from '../edit/edit.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view',
  imports: [ReactiveFormsModule,FormsModule,MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule,CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  title = 'View User';
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
