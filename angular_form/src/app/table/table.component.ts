import {AfterViewInit, ChangeDetectionStrategy, Component, ViewChild, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TableService, userData } from './table.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { UsersComponent } from "../users/users.component";
/**
 * @title Table with pagination
 */
@Component({
  selector: 'table-pagination-example',
  styleUrl: './table.component.css',
  templateUrl: './table.component.html',
  imports: [ MatTableModule, 
             MatPaginatorModule,
             FormsModule,
             RouterModule, 
             MatSortModule,
             MatIconModule,
             MatButtonModule,
             MatTooltipModule,
             MatDialogModule
            ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements  AfterViewInit {
  constructor(private apiservice:TableService){}
  readonly dialog = inject(MatDialog);
  private _liveAnnouncer = inject(LiveAnnouncer);
  term!: "";
  dataSource!:any;
  user_data!: userData[];
  displayedColumns: string[] = ['name', 'email', 'phoneNo','action'];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;
  
  
  fetchUser(){
    this.apiservice.getAllData().subscribe((data)=>{
      this.user_data=data;
      this.dataSource = new MatTableDataSource(this.user_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  
  ngAfterViewInit(): void {
    this.fetchUser(); 
  }
  edit(element:any){
    this.apiservice.editUser(element._id,element).subscribe((data)=>{
      console.log("edit Content",data);
      this.fetchUser(); 
    })

    const dialogRef = this.dialog.open(EditDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  onView(element:any){
    this.apiservice.viewUser(element._id).subscribe((data)=>{
      console.log("view Content",data);
      this.fetchUser(); 
    })
  }

  onDelete(element:any){
    this.apiservice.deleteUser(element._id).subscribe((data)=>{
      console.log("Deleted Content",data);
      this.fetchUser(); 
    })
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
    selector: 'edit.component',
    templateUrl: 'edit.component.html',
    imports: [MatDialogModule, MatButtonModule, UsersComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class EditDialog {}
  