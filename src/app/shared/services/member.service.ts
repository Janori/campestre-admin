import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Service } from './Service';
import 'rxjs/add/operator/map';

@Injectable()
export class MemberService extends Service {

    constructor(private _http: Http) {
        super();
    }

    getAllMembers = () => {
        return this._http.get(this.url + 'members?from=0&count=6000', { headers: this.headers })
                         .map(res => res.json());
    }

    getAllEmployees = () => {
        return this._http.get(this.url + 'employees?from=0&count=6000', { headers: this.headers })
                         .map(res => res.json());
    }

    getAllGuests = () => {
        return this._http.get(this.url + 'guests?from=0&count=6000', { headers: this.headers })
                         .map(res => res.json());
    }

    getMember = (id: number) => {
        return this._http.get(this.url + `members/${id}`, { headers: this.headers })
                         .map(res => res.json());
    }

    deleteFMD = (id: number) => {
        return this._http.put(this.url + `members/delfmd/${id}`, null, { headers: this.headers })
                         .map(res => res.json());
    }

    editMember = (id: number, data: any) => {
        return this._http.put(this.url + `members/${id}`, data,{ headers: this.headers })
                         .map(res => res.json());
    }

    createMember = (data: any) => {
        return this._http.post(this.url + 'members', data, { headers: this.headers })
                         .map(res => res.json());
    }

    getHistorial = (id: number) => {
        return this._http.get(this.url + `members/${id}/historial`, { headers: this.headers })
                         .map(res => res.json());
    }
}
