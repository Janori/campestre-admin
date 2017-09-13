import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    public notificationForm: FormGroup;
    public notificationAppForm: FormGroup;
    constructor(
        public fb: FormBuilder
    ) {
        this.notificationForm = fb.group({
            text: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    onSubmit = () => {
        console.log(this.notificationForm);
    }
}
