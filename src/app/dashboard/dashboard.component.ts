import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
    public links: any = [];
    constructor() {
        this.links = [
            {url: 'comunicados', icon: 'notifications', title: 'Comunicados'},
            {url: 'socios', icon: 'person', title: 'Socios'},
            {url: 'empleados', icon: 'work', title: 'Empleados'},
            {url: 'alberca', icon: 'pool', title: 'Alberca'}
        ];
    }

    ngOnInit() {
    }

    doLogout = () => {
      alert('Not available');
    }

}
