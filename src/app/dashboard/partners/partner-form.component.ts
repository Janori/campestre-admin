import { Component, OnInit, Inject, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

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
    public filteredMembers: Observable<string[]>;
    public lastPayment: any = null;

    public membersFilter: FormControl = new FormControl();
    public paymentForm: FormGroup;

    private _months: string[];
    private _members: any[] = [];

    public stateCtrl: FormControl;
    public filteredStates: Observable<any[]>;

    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _snackBar: MdSnackBar,
        private _memberService: MemberService,
        private _fb: FormBuilder) {
        // console.log(data.member);
        this.paymentForm = this._fb.group({
            paid_up: [null, Validators.required],
            paid_amount: [null, Validators.required]
        });

        this.bloodKinds = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        this.subscriptionKinds = ['DUPLEX', 'FAMILIAR', 'FORANEA', 'INDIVIDUAL', 'INDIVIDUAL 50%', 'INDIVIDUAL 25-30', 'INDIVIDUAL 25-30 AL 50%', 'VERIFICAR'];
        this.memberKinds = [
            { name: 'Titular', value: 'T'},
            { name: 'Asociado', value: 'A'}
        ];

        this._months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    }

    async ngOnInit() {
        this.stateCtrl = new FormControl();
        this.filteredStates = this.stateCtrl.valueChanges
            .startWith(null)
            .map(value => {
                let run = async () => { this._members = await this._memberService.membersFilter(value); }
                run();
                console.log(this._members);
                return this._members;

            });

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
                this.lastPayment = result.data;
            },
            error => { console.log(error); }
        );
        this._snackBar.open('Miembro cargado con éxito', 'Aceptar', {
            duration: 2000,
        });
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

    doPayment = () => {
        if(!confirm('Está apunto de registrar un pago, ¿los datos son correctos?'))
            return;

        let data = {
            member_id: this.data.member.id,
            paid_up: this.paymentForm.get('paid_up').value,
            paid_amount: this.paymentForm.get('paid_amount').value
        }

        data.paid_up = data.paid_up.toISOString().replace(/T.*/,'');

        this._memberService.doPayment(data).subscribe(
            result => {
                if(result.status) {
                    this.lastPayment = result.data;
                    this.lastPayment.payment_date = new Date();
                    this.paymentForm.reset();
                    this._snackBar.open(result.msg, 'Aceptar', {
                        duration: 2000,
                    });
                }
                else {
                    this._snackBar.open(result.msg, 'Aceptar', {
                        duration: 2000,
                    });
                }
            },
            error => { console.log(error); }
        )

    }
}
