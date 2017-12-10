import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MdDialog, MdDialogRef, MdPaginator, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import { Router } from '@angular/router';

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

import { JtableDirective } from '../../shared/directives/jtable.directive';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import {} from '@types/lscache';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  providers: [ MemberService ]
})
export class PartnersComponent implements OnInit {
    public displayedColumns = ['userId', 'code', 'name', 'phone', 'email', 'details'];
    public dataSource: MembersDataSource;
    public membersDatabase: MembersDatabase;
    public resultsPerPage: number;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MdPaginator) paginator: MdPaginator;

    public memberKind: string = '';

    @ViewChild('tbMember', { read: JtableDirective}) tb:JtableDirective;
    @ViewChild('txtSearch') ts;
    values:number[] = [5,10,20,50,100,200,500];

    text:string = "";

    textChanged(e){
      this.modelChanged.next(e);
      //this.tb.query(e);
    }


    model: string;
    modelChanged: Subject<string> = new Subject<string>();


    constructor(
        public dialog: MdDialog,
        private _snackBar: MdSnackBar,
        private _router:Router,
        private _memberService: MemberService) {
            if(this._router.url.includes('socios'))
                lscache.set('table', 'members');
            else if(this._router.url.includes('empleados'))
                lscache.set('table', 'employees');
            else
                lscache.set('table', 'guests');
            this.modelChanged
                .debounceTime(300) // wait 300ms after the last event before emitting last event
                .distinctUntilChanged() // only emit if value is different from previous value
                .subscribe(model =>{
                    this.tb.query(model);
                });
    }

    showMore(){
      this.tb.resultsPerPage = 30;
    }
    changed(){
      this.tb.resultsPerPage = this.resultsPerPage;
    }

    ngOnInit() {
        if(this._router.url.includes('socios'))
            this.memberKind = 'socios';
        else if(this._router.url.includes('empleados'))
            this.memberKind = 'empleados';
        else
            this.memberKind = 'invitados';
    }

    openDialog = (member?: Member): void => {
        if(member == undefined) {
            if(this._router.url.includes('socios'))
                member = new Member();
            else if(this._router.url.includes('empleados'))
                member = new Member({ tipo: Member.KIND.EMPLOYEE });
            else
                member = new Member({ tipo: Member.KIND.GUEST });
        }

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
                if(member.id == null) { // CREATE
                    this._memberService.createMember(member).subscribe(
                        result => {
                            if(result.status) {
                                // this.membersDatabase.addMember(new Member(result.data));
                                this.tb.query();
                                this._snackBar.open('Miembro creado con éxito', 'Aceptar', {
                                    duration: 2000,
                                });
                            }
                            else
                                this._snackBar.open(result.msg, 'Aceptar', {
                                    duration: 2000,
                                });
                        },
                        error => { console.log(error); }
                    );
                }
                else { // EDIT
                    this._memberService.editMember(member.id, member).subscribe(
                        result => {
                            if(result.status)
                                this._snackBar.open('Miembro editado con éxito', 'Aceptar', {
                                    duration: 2000,
                                });
                            else
                                this._snackBar.open(result.msg, 'Aceptar', {
                                    duration: 2000,
                                });
                        },
                        error => { console.log(error); }
                    );
                }
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

    constructor(
        private _memberService: MemberService,
        private _url: string) {

            if(_url.includes('socios'))
                this._memberService.getAllMembers().subscribe(
                    result => { result.data.forEach(member => this.addMember(member)); },
                    error => { console.log(error); }
                );
            else if(_url.includes('empleados'))
                this._memberService.getAllEmployees().subscribe(
                    result => { result.data.forEach(member => this.addMember(member)); },
                    error => { console.log(error); }
                );
            else
                this._memberService.getAllGuests().subscribe(
                    result => { result.data.forEach(member => this.addMember(member)); },
                    error => { console.log(error); }
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
