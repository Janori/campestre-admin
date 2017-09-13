import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [ AuthService ]
})
export class DashboardComponent implements OnInit {
    public links: any = [];
    constructor(
        private _authService: AuthService
    ) {
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
        this._authService.logout();
    }

}
