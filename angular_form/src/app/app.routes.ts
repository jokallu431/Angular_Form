import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent:()=> import ('./users/users.component').then((c)=>c.UsersComponent),
        title:'Form_Page'
    },
    {
        path:'table',
        loadComponent:()=> import ('./table/table.component').then((c)=>c.TableComponent),
        title:'Table_Page'
    }
];
