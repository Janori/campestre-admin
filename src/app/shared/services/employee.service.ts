import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Service } from './Service';
// import { User } from '../model';
import 'rxjs/add/operator/map';

@Injectable()
export class EmployeeService extends Service {
    constructor(
        private _http: Http
    ) {
        super();
    }

    getAllEmployees = () => {
        	let headers = this.headers();
        return this._http.get(this.url + 'employees', { headers })
                         .map(res => res.json());
    }
}
