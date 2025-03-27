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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
/**
 * @title Table with pagination
 */
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
    
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit {
  constructor(private apiservice: TableService,
              private router: Router, 
  ) { }
  private _snackBar = inject(MatSnackBar);
  private _liveAnnouncer = inject(LiveAnnouncer);
  readonly dialog = inject(MatDialog);
  title = 'Angular_Task';
  term!: "";
  dataSource!: any;
  user_data!: userData[];
  displayedColumns: string[] = ['id','name', 'email', 'phoneNo', 'action'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;


  fetchUser() {
    this.apiservice.getAllData().subscribe((data) => {
      this.user_data = data;
      this.dataSource = new MatTableDataSource(this.user_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  ngAfterViewInit(): void {
    this.fetchUser();
  }
   
  edit(element: any) {
    console.log("Edit Content", element._id);
    console.log("Edit Content", element);
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

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === true) {
        this.apiservice.viewUser(element._id).subscribe((data) => {
          console.log("view Content", data);
          this._snackBar.open('User Details','close',{
            duration: 3000
          });
          this.fetchUser();
        })
      }
    });
  }

  onDelete(element: any) {
    const dialogRef = this.dialog.open(ModalDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result === true) {
        this.apiservice.deleteUser(element._id).subscribe((data) => {
          console.log("Deleted Content", data);
          this._snackBar.open('User Deleted','close',{
            duration: 3000
          });
          this.fetchUser();
        })
      }
    });
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
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
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDialog { }


@Component({
  selector: 'app-view-user-dialog',
  styleUrl: './table.component.css',
  templateUrl: './View.component.html',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewModalDialog { 
  constructor(
    public dialogRef: MatDialogRef<ViewModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  // Close the dialog
  closeDialog() {
    this.dialogRef.close();
  }
 }