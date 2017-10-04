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
    public lastPayment: any = null;

    public paymentForm: FormGroup;

    public memberCtrl: FormControl = new FormControl();
    public filteredMembers: Observable<any[]>;

    public referencedMembers: any[] = [];

    private _months: string[];
    private _members: any[] = [];

    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _snackBar: MdSnackBar,
        private _memberService: MemberService,
        private _fb: FormBuilder) {
        console.log(data.member);
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
        this.filteredMembers = this.memberCtrl.valueChanges
            .startWith(null)
            .map(value => {
                let run = async () => { this._members = await this._memberService.membersFilter(value); }
                run();

                return this._members;
            });

        if(this.data.member.is('invitado')) {
            this._memberService.getHosts(this.data.member.id).subscribe(
                result => {
                    this.referencedMembers = result.data;
                },
                error => console.log(error)
            )
        }

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

    setRelation = ($event) => {
        let ref_id      = $event.option.value;
        let member_id   = this.data.member.id;

        this._memberService.setRelation(member_id, ref_id).subscribe(
            result => {
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });

                if(result.status)
                    this.data.member.father = new Member(result.data);
            },
            error => console.log(error)
        )
    }

    unsetRelation = (member_id: number) => {
        if(!confirm('Estás apunto de eliminar la relación con este miembro'))
            return;

        this._memberService.unsetRelation(this.data.member.id).subscribe(
            result => {
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });

                if(result.status) {
                    this.data.member.tipo = 'T';
                    this.data.member.father = null;
                }
            },
            error => console.log(error)
        )
    }

    setGuestRelation = ($event) => {
        let ref_id      = $event.option.value;
        let member_id   = this.data.member.id;

        this._memberService.setGuestRelation(member_id, ref_id).subscribe(
            result => {
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });

                if(result.status)
                    this.referencedMembers.push(result.data);
            },
            error => console.log(error)
        );
    }

    unsetGuestRelation = (ref_id: number) => {
        if(!confirm('Estás apunto de eliminar la relación con este miembro'))
            return;

        this._memberService.unsetGuestRelation(this.data.member.id, ref_id).subscribe(
            result => {
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });

                if(result.status) {
                    this.referencedMembers = this.referencedMembers.filter(member => {
                        return member.id != ref_id;
                    });
                }
            },
            error => console.log(error)
        )
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
