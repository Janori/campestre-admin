import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.scss']
})

export class PoolComponent implements OnInit {
    public poolForm: FormGroup;

    constructor(
        public fb: FormBuilder
    ) {
        this.poolForm = fb.group({
            firstPool: ['', Validators.required],
            secondPool: ['', Validators.required]
        });
    }

    ngOnInit() {
    }

    onSubmit = () => {
        console.log(this.poolForm);
    }

}
