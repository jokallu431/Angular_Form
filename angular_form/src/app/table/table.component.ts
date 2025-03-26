import {Component, OnInit, ViewChild, inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TableService, userData } from './table.service';

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
            ],
})
export class TableComponent implements OnInit {
  constructor(private apiservice:TableService){}
  private _liveAnnouncer = inject(LiveAnnouncer);
  term!: "";
  dataSource!:any;
  user_data!: userData[];
  displayedColumns: string[] = ['name', 'email', 'phoneNo','edit'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    this.fetchUser();
  }
  
  fetchUser(){
    this.apiservice.getAllData().subscribe((data)=>{
      this.user_data=data;
      this.dataSource = new MatTableDataSource(this.user_data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  edit(){

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
