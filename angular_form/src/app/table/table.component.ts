import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TableService, userData } from './table.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from "../loading/loading.component";
@Component({
  selector: 'table-pagination-example',
  styleUrl: './table.component.css',
  templateUrl: './table.component.html',
  imports: [MatTableModule,
    MatPaginatorModule,
    FormsModule,
    RouterModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    CommonModule,
    LoadingComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent implements AfterViewInit {

  constructor(private apiservice: TableService,
    private router: Router,
  ) { }

  private _liveAnnouncer = inject(LiveAnnouncer);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  title = 'Users Table';
  dataSource!: any;
  user_data!: userData[];
  pageNumbers :number[]=[5,10,15];
  itemPerPage:number=5;
  totalItems!:number;
  isLoading=true;
  displayedColumns: string[] = ['SrNo', 'name', 'email', 'phoneNo', 'action'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
   fetchUser() {
    this.apiservice.getAllData().subscribe((data) => {
      
      if(data.length<=0){
        this.isLoading=true;
      }else{
        this.isLoading=false;
        this.user_data = data;
        this.dataSource = new MatTableDataSource(this.user_data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculate();
      }
    })
  }
  calculate(){
    this.totalItems=Math.ceil(this.user_data.length/this.itemPerPage);
        console.log("length",this.user_data.length);
        console.log("total items",this.totalItems);
        console.log("before cal",this.pageNumbers);
        for(let i=2;i<=this.totalItems;i++){
          this.pageNumbers.push(i*5);
        }
        console.log("after cal",this.pageNumbers);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  ngAfterViewInit(): void {
    this.fetchUser();
  }

  edit(element: any) {
    this.router.navigate(['/edit', element]);
  }
  onView(element: any) {
    const dialogRef = this.dialog.open(ViewModalDialog, {
      width: '400px',
      data: {
        name: element.name,
        email: element.email,
        phoneNo: element.phoneNo
      }
    });

    this._snackBar.open("View User ", "OK", {
      duration: 3000,
      panelClass: ['green-snackbar'],
     });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.apiservice.viewUser(element._id).subscribe(() => {
          this.fetchUser();
        })
      }
    });
  }

  onDelete(element: any) {
    const dialogRef = this.dialog.open(ModalDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.apiservice.deleteUser(element._id).subscribe(() => {
          this._snackBar.open("User Deleted Successfully", "OK", {
            duration: 3000,
            panelClass: ['red-snackbar', 'login-snackbar'],
           });
          this.fetchUser();
        })
      }
    });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

@Component({
  selector: 'modal.component',
  templateUrl: 'modal.component.html',
  imports: [MatDialogModule, MatButtonModule,MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog { }


@Component({
  selector: 'app-view-user-dialog',
  styleUrl: './table.component.css',
  templateUrl: './View.component.html',
  imports: [MatDialogModule, MatButtonModule,MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModalDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
  closeDialog() {
    this.dialogRef.close();
  }
}