
import { Component} from '@angular/core';
import { FormControl, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  profileForm = new FormGroup({
    name: new FormControl('',Validators.required),
    email: new FormControl('',[Validators.required,Validators.email]),
    phoneNo: new FormControl('',Validators.required),
  });

  constructor(private service:UsersService,private router:Router){}
  handleSubmit(data: any) {
    console.log("data",data);
    this.service.postData(data).subscribe(()=>{
      console.log("result",data);
      if(data){
        // [routerLink]="['/table']" routerLinkActive="router-link-active" 
          this.router.navigate(['/table']);
      }
    });
  }
}
