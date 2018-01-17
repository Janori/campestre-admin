import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef, MdPaginator, MD_DIALOG_DATA, MdSnackBar} from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Notification } from '../../shared/models/Notification';
import { NotificationService } from '../../shared/services/notification.service';
import { NotificationFormComponent } from './notification-form/notification-form.component';
import { RequestOptions } from '@angular/http';

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
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    providers: [ NotificationService ]
})

export class NotificationsComponent implements OnInit {
    public notificationPushForm: FormGroup;
    public notificationAppForm: FormGroup;

    public resultsPerPage: number;

    @ViewChild('filter') filter: ElementRef;
    @ViewChild(MdPaginator) paginator: MdPaginator;

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
        public fb: FormBuilder,
        private _snackBar: MdSnackBar,
        public _notificationService: NotificationService,
        public dialog: MdDialog
    ) {
        this.notificationPushForm = fb.group({
            text: ['', Validators.required],
        });

        this.notificationAppForm = fb.group({
            text: ['', Validators.required],
            title: ['', Validators.required],
            image: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    showMore(){
      this.tb.resultsPerPage = 30;
    }
    changed(){
      this.tb.resultsPerPage = this.resultsPerPage;
    }

    openDialog = (notification?: Notification): void => {
        if(notification == undefined)
            notification = new Notification();

        let dialogRef = this.dialog.open(NotificationFormComponent, {
            width: '700px',
            data: {
                notification: notification,
                closeDialog: (data: any) => {
                    dialogRef.close(data);
                }
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == true) {
                if(notification.id == null) { // CREATE
                    this._notificationService.createNotification(notification).subscribe(
                        result => {
                            if(result.status) {
                                this.tb.query();
                                this._snackBar.open('Notification creada con éxito', 'Aceptar', {
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
                    this._notificationService.editNotification(notification.id, notification).subscribe(
                        result => {
                            if(result.status)
                                this._snackBar.open('Notification editada con éxito', 'Aceptar', {
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
            } else if(result == false)  {
                if(notification.id == null) { // CANCEL NEW ERASE IMAGE
                    let url = lscache.get('lastImageUpdated');
                    this._notificationService.eraseImage(url).subscribe(result => {
                        console.log('Imagen eliminada');
                    });
                }
            }
        });
    }

    deleteNotification(notification: Notification) {
        if(!confirm('¿Estás seguro que deseas eliminar este registro?'))
            return;

        this._notificationService.deleteNotification(notification.id).subscribe(result => {
            if(result.status) {
                this.tb.query();
                this._snackBar.open('Notification eliminada con éxito', 'Aceptar', {
                    duration: 2000,
                });
            }
            else
                this._snackBar.open(result.msg, 'Aceptar', {
                    duration: 2000,
                });
        });
    }

    sendPushNotification() {
        this.notificationPushForm.reset();

        this._snackBar.open('Mensaje enviado al servidor', 'Aceptar', {
            duration: 2000,
        });
    }
}
