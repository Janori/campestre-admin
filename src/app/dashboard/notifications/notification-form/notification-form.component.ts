import { Component, OnInit, Inject, ViewChild} from '@angular/core';

import { MD_DIALOG_DATA, MdDatepicker, MdSnackBar } from '@angular/material';

import { NotificationService } from '../../../shared/services';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss'],
  providers: [ NotificationService ]
})

export class NotificationFormComponent implements OnInit {

    constructor(
        @Inject(MD_DIALOG_DATA) public data: any,
        private _notificationService: NotificationService
        ) { }

    ngOnInit() {
        console.log(this.data);
    }


    fileChange(event) {
        let fileList: FileList = event.target.files;
        console.log(fileList);
        if(fileList.length > 0) {
            let file: File = fileList[0];
            let formData:FormData = new FormData();
            formData.append('file', file);

            this._notificationService.uploadImage(formData).subscribe(result => {
                if(result.status)
                    this.data.notification.url = result.data.url;
            });
        }
    }

}
