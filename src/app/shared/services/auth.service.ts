import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { Service } from '../services/Service';
declare var lscache: any;

@Injectable()

export class AuthService extends Service {
	constructor(
		private _http: Http,
		private _router: Router
	) {
		super();
	}

    isLoggedIn = () => {
        return !!lscache.get('authToken');
    }

	login = (user: any) => {
		let params = JSON.stringify(user);
		return this._http.post(this.url + 'authenticate', params, { headers: this.headers })
						 .map(res => res.json());
    }

	logout = () => {
        lscache.flush();
		this._router.navigate(['login']);
	}
}
