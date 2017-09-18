import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MdDialog, MdDialogRef, MdPaginator, MD_DIALOG_DATA} from '@angular/material';

import { PartnerFormComponent } from './partner-form.component';
import { MemberService } from '../../shared/services';
import { Member } from '../../shared/models';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';


@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  providers: [ MemberService ]
})
export class PartnersComponent implements OnInit {
    public displayedColumns = ['userId', 'code', 'name', 'phone', 'email', 'details'];
    public dataSource: MembersDataSource;
    public membersDatabase: MembersDatabase;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    constructor(
        public dialog: MdDialog,
        private _memberService: MemberService) {
            this.membersDatabase = new MembersDatabase(this._memberService);
    }

    ngOnInit() {
        this.dataSource = new MembersDataSource(this.membersDatabase, this.paginator);
        Observable.fromEvent(this.filter.nativeElement, 'keyup')
            .debounceTime(150)
            .distinctUntilChanged()
            .subscribe(() => {
              if (!this.dataSource) { return; }
              this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    openDialog = (member: Member): void => {
        let dialogRef = this.dialog.open(PartnerFormComponent, {
            width: '700px',
            data: {
                member: member,
                closeDialog: (data: any) => {
                    dialogRef.close(data);
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == true) {

            }
            else if(Number.isInteger(result)) {
                this.openDialog(this.membersDatabase.data.slice().filter(item => {
                    return item.id == result;
                })[0]);
                return;
            }
        });
    }
}

export class MembersDatabase {
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    get data(): any[] { return this.dataChange.value; }

    constructor(private _memberService: MemberService) {
        this._memberService.getAllMembers().subscribe(
            result => {
                result.data.forEach(member => this.addMember(member));
            },
            error => {
                console.log(error);
            }
        );
    }

    addMember(data: any) {
        const copiedData = this.data.slice();
        copiedData.push(new Member(data));
        this.dataChange.next(copiedData);
    }
}

export class MembersDataSource extends DataSource<any> {
    public _filterChange = new BehaviorSubject('');
    get filter(): string { return this._filterChange.value; }
    set filter(filter: string) { this._filterChange.next(filter); }

    constructor(
        private membersDatabase: MembersDatabase,
        private _paginator: MdPaginator) {
            super();
    }

    connect(): Observable<Member[]> {
        const displayDataChanges = [
            this.membersDatabase.dataChange,
            this._filterChange,
            this._paginator.page,
        ];

        return Observable.merge(...displayDataChanges).map(() => {
            const data = this.membersDatabase.data.slice();
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;

            return this.membersDatabase.data.slice().filter((item) => {
                let searchStr = (item.id + item.nombre + item.info.code).toLowerCase();
                return searchStr.indexOf(this.filter.toLowerCase()) != -1;
            }).splice(startIndex, this._paginator.pageSize);
        });
    }

    disconnect() {}
}
