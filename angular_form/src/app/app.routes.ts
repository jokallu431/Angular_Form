import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=> import ('./login/login.component').then((c)=>c.LoginComponent),
        title:'Login_Page'
    },
    {
        path:'form',
        loadComponent:()=> import ('./users/users.component').then((c)=>c.UsersComponent),
        title:'Form_Page'
    },
    {
        path:'table',
        loadComponent:()=> import ('./table/table.component').then((c)=>c.TableComponent),
        title:'Table_Page'
    },
    {
        path:'edit/:id',
        loadComponent:()=> import ('./table/edit/edit.component').then((c)=>c.EditComponent),
        title:'Edit_Page'
    }
];
