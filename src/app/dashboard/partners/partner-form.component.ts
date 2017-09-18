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
    // @ViewChild(MdDatepicker) picker: MdDatepicker<Date>;
    historialdisplayedColumns = ['month', 'amount', 'status'];
    historialDataSource = new PaymentDataSource();

    public bloodKinds: string[];
    public subscriptionKinds: string[];

    public files: any = [
        { name: 'PDF_AN_1397144.PDF', updated: new Date()}
    ];

    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _snackBar: MdSnackBar,
        private _memberService: MemberService) {
        console.log(data.member);
        this.bloodKinds = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        this.subscriptionKinds = ['DUPLEX', 'FAMILIAR', 'FORANEA', 'INDIVIDUAL', 'INDIVIDUAL 50%', 'INDIVIDUAL 25-30', 'INDIVIDUAL 25-30 AL 50%', 'VERIFICAR'];
    }

    ngOnInit() {
        if(Number.isInteger(this.data.member.father)) {
            this._memberService.getMember(this.data.member.father).subscribe(
                result => {
                    this.data.member.father = new Member(result.data);
                },
                error => { console.log(error); }
            )
        }
        this._snackBar.open('Miembro cargado con éxito', 'Aceptar', {
            duration: 2000,
        });
    }

    setData = (id: number) => {
        this.data.closeDialog(id);
    }
}

export interface PaymentHistorial {
    month: string;
    amount: string;
    status: string;
}

const paymentData: PaymentHistorial[] = [
    {month: 'Septiembre', amount: '1600', status: 'Pendiente' }
];


export class PaymentDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PaymentHistorial[]> {
    return Observable.of(paymentData);
  }

  disconnect() {}
}
