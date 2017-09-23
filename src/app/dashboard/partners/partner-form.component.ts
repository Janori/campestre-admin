import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { MemberService } from '../../shared/services';
import { Member } from '../../shared/models';

import { MD_DIALOG_DATA, MdDatepicker, MdSnackBar } from '@angular/material';

import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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

    public files: any = [
        { name: 'PDF_AN_1397144.PDF', updated: new Date()}
    ];

    private _months: string[];

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
        this._calculateMonths();
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

    doPayment = (data: any, index: number) => {
        console.log(data, index);
        data.status = 'Pagado';
    }
}
