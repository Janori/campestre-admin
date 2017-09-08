import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { PartnerFormComponent } from './partner-form.component';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html'
})
export class PartnersComponent implements OnInit {
    displayedColumns = ['userId', 'name', 'phone', 'address', 'createdAt', 'details'];
    exampleDatabase = new ExampleDatabase();
    dataSource: ExampleDataSource | null;

    @ViewChild('filter') filter: ElementRef;

    constructor(public dialog: MdDialog) {}

    ngOnInit() {
        this.dataSource = new ExampleDataSource(this.exampleDatabase);
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
         console.log('The dialog was closed');
        //  this.animal = result;
       });
    }
}


/** Constants used to fill up our data base. */
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomNumbers(length) {
  var text = "";
  var possible = "0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

const LAST_NAMES = [
    'Sandoval', 'Trujillo', 'Salas', 'Guerrero', 'Lomelí', 'Rincón', 'Gómez', 'Jímenez', 'Arévalo'
];

const STREET = [
    'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Sétima', 'Octava'
]

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
  phone: string;
  address: string;
  rfid: string;
  thumb: string;
  created_at: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 20; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        LAST_NAMES[Math.round(Math.random() * (LAST_NAMES.length - 1))];

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
      phone: '33' + randomNumbers(8),
      address: STREET[Math.round(Math.random() * (STREET.length - 1))] + ' ' + randomNumbers(2),
      rfid: '108006998800',
      thumb: '0x0fsdf7f555hddasd7688j68d6766dgd',
      created_at: randomDate(new Date(2012, 0, 1), new Date()).toString()
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

  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._filterChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this._exampleDatabase.data.slice().filter((item: UserData) => {
        let searchStr = (item.name + item.color).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
    });
  }

  disconnect() {}
}
