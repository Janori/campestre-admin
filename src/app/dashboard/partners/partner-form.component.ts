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
    public visitForm: FormGroup;

    @ViewChild('memberID') memberID;

    public memberCtrl: FormControl = new FormControl();
    public filteredMembers: Observable<any[]>;

    public referencedMembers: any[] = [];
    public _status: any[] = [];

    public _months: string[];
    private _members: any[] = [];

    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _snackBar: MdSnackBar,
        private _memberService: MemberService,
        private _fb: FormBuilder) {
        console.log(data.member);
        this.paymentForm = this._fb.group({
            month: [null, Validators.required],
            year: [null, Validators.required]
        });

        this.visitForm = this._fb.group({
            member_id: [null, Validators.required],
            date: [null, Validators.required]
        });

        this.bloodKinds = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
        this.subscriptionKinds = ['DUPLEX', 'FAMILIAR', 'FORANEA', 'INDIVIDUAL', 'INDIVIDUAL 50%', 'INDIVIDUAL 25-30', 'INDIVIDUAL 25-30 AL 50%', 'VERIFICAR', 'FUTBOL', 'BALLET'];
        this.memberKinds = [
            { name: 'Titular', value: 'T'},
            { name: 'Asociado', value: 'A'}
        ];

        this._months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        // this._status = Member.status;
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
            month: this.paymentForm.get('month').value,
            year: this.paymentForm.get('year').value
        };


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
        );

    }

    registerVisit = () => {


        let data = {
            guest_id:   this.data.member.id,
            member_id:  this.memberID.nativeElement.value,
            date:       this.visitForm.get('date').value,
            days:       this._diffTime(new Date(), new Date(this.visitForm.get('date').value)),
        };

        data.date = data.date.toISOString().replace(/T.*/,'');
        // 1st Filter

        if(data.days > 2)
            if(!confirm('La visita que estás a punto de registar es mayor a dos días, ¿tienes autorización?'))
                return;

        // 2nd Filter
        this._memberService.checkVisits(data.guest_id).subscribe(
            result => {
                if(result.data >= 2)
                    if(!confirm('Este invitado ya ha ingresado 2 o más veces este mes, ¿tienes autorización?'))
                        return;

                this._memberService.registerVisit(data.guest_id, data).subscribe(
                    result => {
                        this.visitForm.reset();
                        this._snackBar.open(result.msg, 'Aceptar', {
                            duration: 2000,
                        });
                    }
                );

            },
            error => console.log(error)
        );
    }

    _diffTime = (date1: Date, date2: Date): number => {
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return diffDays;
    }
}
