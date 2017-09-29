import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';

import { MemberService } from '../../shared/services';
import { Member } from '../../shared/models';

import { MD_DIALOG_DATA, MdDatepicker, MdSnackBar } from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-partner-form',
    templateUrl: './partner-form.component.html',
    providers: [ MemberService ]
})
export class PartnerFormComponent implements OnInit {
    public bloodKinds: string[];
    public subscriptionKinds: string[];
    public memberKinds: any[];
    public lastThreeMonths: any[] = [];
    public filteredMembers: Observable<string[]>;

    public membersFilter: FormControl = new FormControl();

    public files: any = [
        { name: 'PDF_AN_1397144.PDF', updated: new Date()}
    ];


    private _months: string[];
    private members: any = ['One',
    'Two',
    'Three'];

    stateCtrl: FormControl;
  filteredStates: Observable<any[]>;

  states: any[] = [
    {
      name: 'Arkansas',
      population: '2.978M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Arkansas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arkansas.svg'
    },
    {
      name: 'California',
      population: '39.14M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_California.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Flag_of_California.svg'
    },
    {
      name: 'Florida',
      population: '20.27M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Florida.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Florida.svg'
    },
    {
      name: 'Texas',
      population: '27.47M',
      // https://commons.wikimedia.org/wiki/File:Flag_of_Texas.svg
      flag: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Flag_of_Texas.svg'
    }
  ];


    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _snackBar: MdSnackBar,
        private _memberService: MemberService) {
        console.log(data.member);
        this.bloodKinds = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        this.subscriptionKinds = ['DUPLEX', 'FAMILIAR', 'FORANEA', 'INDIVIDUAL', 'INDIVIDUAL 50%', 'INDIVIDUAL 25-30', 'INDIVIDUAL 25-30 AL 50%', 'VERIFICAR'];
        this.memberKinds = [
            { name: 'Titular', value: 'T'},
            { name: 'Asociado', value: 'A'}
        ];

        this._months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    }

    ngOnInit() {
        this.stateCtrl = new FormControl();
   this.filteredStates = this.stateCtrl.valueChanges
       .startWith(null)
       .map(state => state ? this.filterStates(state) : this.states.slice());
        this._calculateMonths();

        this.filteredMembers = this.membersFilter.valueChanges
            .startWith(null)
            .map(val => val ? this.filter(val) : this.members.slice());

        if(Number.isInteger(this.data.member.father)) {
            this._memberService.getMember(this.data.member.father).subscribe(
                result => {
                    this.data.member.father = new Member(result.data);
                },
                error => { console.log(error); }
            )
        }

        this._memberService.getHistorial(this.data.member.id).subscribe(
            result => {
                this._loadPayments(result.data);
            },
            error => { console.log(error); }
        );
        this._snackBar.open('Miembro cargado con éxito', 'Aceptar', {
            duration: 2000,
        });
    }

    filterStates(name: string) {
    return this.states.filter(state =>
      state.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

    _calculateMonths = () => {
        this.lastThreeMonths = [];

        for(let i = 0; i < 3; i++) {
            let date = new Date();
            let label = '';

            date.setMonth(date.getMonth() - i);
            label = this._months[date.getMonth()] + ' ' + date.getFullYear();

            this.lastThreeMonths.push({month: date, status: 'Pendiente', label: label});
        }
    }

    _loadPayments = (data: any) => {
        for(let historial of data) {
            let date = new Date(historial.date);

            this.lastThreeMonths.forEach((payment, i, payments) => {
                if(payment.month.getMonth() == date.getMonth())
                    payments[i].status = 'Pagado';
            });
        }
    }

    filter = (val: string) : string[] => {
        return this.members.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    setData = (id: number) => {
        this.data.closeDialog(id);
    }

    deleteFMD = (id: number) => {
        this._memberService.deleteFMD(id).subscribe(
            result => {
                this.data.member.info.fmd = '';
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });

            },
            error => { console.log(error); }
        );
    }

    doPayment = (id: number, payment: any) => {
        let data = {
            member_id: id,
            month: payment.month.getFullYear() + '-' + ("0" + (payment.month.getMonth() + 1)).slice(-2)
        };

        this._memberService.doPayment(data).subscribe(
            result => {
                console.log(result);
            },
            error => { console.log(error); }
        );
        // payment.status = 'Pagado';

    }
}
