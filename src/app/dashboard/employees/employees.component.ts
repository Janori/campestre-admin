import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MdDialog, MdDialogRef, MdPaginator, MD_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PartnerFormComponent } from '../partners/partner-form.component';
import { EmployeeService } from '../../shared/services/employee.service';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [ EmployeeService ]
})
export class EmployeesComponent implements OnInit {
    displayedColumns = ['userId', 'name', 'details'];
    exampleDatabase = new ExampleDatabase(this._employeeService);
    dataSource: ExampleDataSource | null;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(public dialog: MdDialog,
                private _employeeService:EmployeeService) {}

  ngOnInit() {
      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator);
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });
  }

  openDialog = (user: any): void => {
      let dialogRef = this.dialog.open(PartnerFormComponent, {
          width: '700px',
          data: { user: user }
     });

     dialogRef.afterClosed().subscribe(result => {
       if(result){
         let data = {
            "nombre": user.name,
            "tipo": null,
            "info": {
                "pin": "",
                "rfid": user.rfid ? user.rfid : '',
                "fmd": user.thumb ? user.thumb : '' ,
                "code": user.code ? user.code : ''
            },
            "data": {
                "code": user.code ? user.code : '',
                "tipo_membresia": user.tipo_membresia ? user.tipo_membresia : '',
                "email": user.email ? user.email : '',
                "direccion": user.address ? user.address : '',
                "rfc": "XAXX010101000",
                "fecha_nacimiento": "2017-04-04 00:00:00",
                "tipo_sangre": user.tipo_sangre ? user.tipo_sangre : '',
                "celular": user.phone ? user.phone : '',
                "telefono": "0",
                "status": null
            }
        }
        // this._employeeService.updateUser(user.id, data).subscribe(res=>{
        //   if(res.status){
        //     console.log(res.data);
        //   }else console.log("No guardado");
        // },error=>{
        //   console.log(error);
        // });
       }
     });
  }
}

export interface UserData {
id: string;
name: string;
progress: string;
code: string;
phone: string;
address: string;
rfid: string;
thumb: string;
created_at: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
/** Stream that emits whenever the data has been modified. */
dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
get data(): any[] { return this.dataChange.value; }

constructor(private _employeeService:EmployeeService) {
  // Fill up the database with 100 users.
  this._employeeService.getAllEmployees().subscribe(res=>{
    for(let d of res.data){
      this.addUser(d);
    }
  }, error=>{
    console.log(error);
  });
  //for (let i = 0; i < 20; i++) { this.addUser(); }
}

/** Adds a new user to the database. */
addUser(data:any) {
  const copiedData = this.data.slice();
  copiedData.push(this.createNewUser(data));
  this.dataChange.next(copiedData);
}

/** Builds and returns a new User. */
private createNewUser(data:any) {

  return {
    id: data.id,
    name: data.nombre,
    phone: data.data ? data.data.celular : '',
    email: data.data ? data.data.email : '',
    address: data.data ? data.data.direccion : '',
    rfid: data.info ? data.info.rfid : '',
    thumb: data.info ? data.info.fmd : '',
    code: data.data ? data.info.code : '',
    tipo_membresia: data.data ? data.data.tipo_membresia : '',
    tipo_sangre: data.data ? data.data.tipo_sangre : '',
  };
}
}

/**
* Data source to provide what data should be rendered in the table. Note that the data source
* can retrieve its data in any way. In this case, the data source is provided a reference
* to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
* the underlying data. Instead, it only needs to take the data and send the table exactly what
* should be rendered.
*/
export class ExampleDataSource extends DataSource<any> {
_filterChange = new BehaviorSubject('');
get filter(): string { return this._filterChange.value; }
set filter(filter: string) { this._filterChange.next(filter); }

constructor(private _exampleDatabase: ExampleDatabase,
            private _paginator: MdPaginator) {
  super();
}

/** Connect function called by the table to retrieve one stream containing the data to render. */
connect(): Observable<UserData[]> {
  const displayDataChanges = [
    this._exampleDatabase.dataChange,
    this._filterChange,
    this._paginator.page,
  ];

  return Observable.merge(...displayDataChanges).map(() => {
    const data = this._exampleDatabase.data.slice();

    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

    return this._exampleDatabase.data.slice().filter((item) => {
      let searchStr = (item.code + item.name + item.correo).toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) != -1;
    }).splice(startIndex, this._paginator.pageSize);
  });
}

disconnect() {}
}
