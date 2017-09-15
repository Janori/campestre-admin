import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MD_DIALOG_DATA, MdDatepicker } from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-partner-form',
  templateUrl: './partner-form.component.html'
})
export class PartnerFormComponent implements OnInit {
    @ViewChild(MdDatepicker) picker: MdDatepicker<Date>;
    historialdisplayedColumns = ['month', 'amount', 'status'];
    historialDataSource = new PaymentDataSource();
    logdisplayedColumns = ['date',  'type'];
    logDataSource = new LogDataSource();

    public bloodKinds: string[];
    public subscriptionKinds: string[];

    public files: any = [
        { name: 'PDF_AN_1397144.PDF', updated: new Date()}
    ];

    constructor(@Inject(MD_DIALOG_DATA) public data: any) {
        this.bloodKinds = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        this.subscriptionKinds = ['DUPLEX', 'FAMILIAR', 'FORANEA', 'INDIVIDUAL', 'INDIVIDUAL 50%', 'INDIVIDUAL 25-30', 'INDIVIDUAL 25-30 AL 50%', 'VERIFICAR'];
    }

    ngOnInit() {
    }
}

export interface PaymentHistorial {
    month: string;
    amount: string;
    status: string;
}

const paymentData: PaymentHistorial[] = [
    {month: 'Junio', amount: '1600', status: 'Pagado' },
    {month: 'Julio', amount: '1600', status: 'Pagado' },
    {month: 'Agosto', amount: '1600', status: 'Pagado' },
    {month: 'Septiembre', amount: '1600', status: 'Pendiente' }
];

export interface Log {
    date: string;
    type: string;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const logData: Log[] = [
    { date: randomDate(new Date(2012, 0, 1), new Date()).toString(), type: 'Entrada'},
    { date: randomDate(new Date(2012, 0, 1), new Date()).toString(), type: 'Salida'},
    { date: randomDate(new Date(2012, 0, 1), new Date()).toString(), type: 'Entrada'},
    { date: randomDate(new Date(2012, 0, 1), new Date()).toString(), type: 'Salida'},
];

export class LogDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Log[]> {
    return Observable.of(logData);
  }

  disconnect() {}
}


export class PaymentDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<PaymentHistorial[]> {
    return Observable.of(paymentData);
  }

  disconnect() {}
}
