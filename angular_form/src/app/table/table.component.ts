import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
@Component({
  selector: 'table-pagination-example',
  styleUrl: './table.component.css',
  templateUrl: './table.component.html',
  imports: [
    MatTableModule,
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
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit{
  constructor(private apiservice: TableService, private router: Router) {}

  private _liveAnnouncer = inject(LiveAnnouncer);
  private _snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);
  title = 'Users Table';
  dataSource!: any;
  user_data!: userData[];
  pageNumbers: number[] = [5];
  itemPerPage: number = 5;
  totalItems: number = 0;
  isLoading = true;
  displayedColumns: string[] = ['SrNo', 'name', 'email', 'phoneNo', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit(): void {
    this.fetchUser(); 
  }
  fetchUser() {
    this.apiservice.getAllData().subscribe({
      next: (data) => {
        this.isLoading = false;

        if (data.length <= 0) {
          this.isLoading = true;
          this._snackBar.open('No data available', 'OK', {
            duration: 3000,
            panelClass: ['red-snackbar'],
          });
        } else {
          this.isLoading = false;
          this._snackBar.open('Data fetched successfully', 'OK', {
            duration: 3000,
            panelClass: ['green-snackbar'],
          });
          this.user_data = data;
          this.dataSource = new MatTableDataSource(this.user_data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.calculate();
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
        this._snackBar.open(
          'An error occurred while fetching the data. Please try again.',
          'OK',
          {
            duration: 3000,
            panelClass: ['red-snackbar'],
          }
        );
      },
    });
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
        phoneNo: element.phoneNo,
      },
    });

    this._snackBar.open('View User ', 'OK', {
      duration: 3000,
      panelClass: ['green-snackbar'],
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === true) {
          this.apiservice.viewUser(element._id).subscribe({
            next: () => {
              this.fetchUser();
            },
            error: (err) => {
              console.error('Error fetching data:', err);
              this.isLoading = false;
              this._snackBar.open(
                err.error?.message ||
                'An error occurred while fetching the user',
                'OK',
                {
                  duration: 3000,
                  panelClass: ['red-snackbar'],
                }
              );
            },
          });
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
        this.isLoading = false;
        this._snackBar.open(
          'An error occurred while fetching the data. Please try again.',
          'OK',
          {
            duration: 3000,
            panelClass: ['red-snackbar'],
          }
        );
      },
    });
  }

  onDelete(element: any) {
    const dialogRef = this.dialog.open(ModalDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.apiservice.deleteUser(element._id).subscribe({
          next: () => {
            this._snackBar.open('User Deleted Successfully', 'OK', {
              duration: 3000,
              panelClass: ['green-snackbar', 'login-snackbar'],
            });
            this.fetchUser();
          },
          error: (err) => {
            // Handle error here
            console.error('Error deleting user:', err);
            this._snackBar.open('Failed to Delete User. Please try again later.', 'OK', {
              duration: 3000,
              panelClass: ['red-snackbar', 'error-snackbar'],
            });
          }
        });
      }
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = function (data:any,value:string) {
      return data.name.indexOf(value)!=-1||data.phoneNo.indexOf(value)!=-1||data.email.indexOf(value)!=-1;
   }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  calculate() {
    if (!this.user_data || !Array.isArray(this.user_data)) {
      return;
    }
    this.pageNumbers = [5]; // Initialize with common options
    this.totalItems = Math.ceil(this.user_data.length / this.itemPerPage);
    let maxPageSize = this.user_data.length;

    for (let i = 1; i <= this.totalItems; i++) {
      let pageSize = i * 5;
      if (pageSize <= maxPageSize && !this.pageNumbers.includes(pageSize)) {
        this.pageNumbers.push(pageSize);
      }
      if (!this.pageNumbers.includes(maxPageSize)) {
        this.pageNumbers.push(maxPageSize);
      }
    }
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
  imports: [MatDialogModule, MatButtonModule, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog {}

@Component({
  selector: 'app-view-user-dialog',
  styleUrl: './table.component.css',
  templateUrl: './View.component.html',
  imports: [MatDialogModule, MatButtonModule, MatTooltip],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModalDialog {
  constructor(
    public dialogRef: MatDialogRef<ViewModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  closeDialog() {
    this.dialogRef.close();
  }
}
