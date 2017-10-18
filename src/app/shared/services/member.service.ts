import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Service } from './Service';
import { IService } from './iservice';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class MemberService extends Service implements IService {

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

    doPayment = (data: any) => {
        return this._http.post(this.url + 'members/paymonth', data, { headers: this.headers })
                         .map(res => res.json());
    }

    async membersFilter(value: string) {
        const response = await this._http.get(this.url + 'members?from=0&count=10&query=' + value, { headers: this.headers }).toPromise();
        return response.json().data;
    }

    setRelation = (member_id: number, ref_id: number) => {
        return this._http.put(this.url + `members/${member_id}/setrel/${ref_id}`, null, { headers: this.headers })
                         .map(res => res.json());
    }

    unsetRelation = (member_id: number) => {
        return this._http.put(this.url + `members/${member_id}/unsetrel`, null, { headers: this.headers })
                         .map(res => res.json());
    }

    setGuestRelation = (member_id: number, ref_id: number) => {
        return this._http.post(this.url + `guests/${member_id}/setrel/${ref_id}`, null, { headers: this.headers })
                         .map(res => res.json());
    }

    unsetGuestRelation = (member_id: number, ref_id: number) => {
        return this._http.put(this.url + `guests/${member_id}/unsetrel/${ref_id}`, null, { headers: this.headers})
                         .map(res => res.json());
    }

    getHosts = (member_id: number) => {
        return this._http.get(this.url + `guests/${member_id}/hosts`,{ headers: this.headers })
                          .map(res => res.json());
    }

    checkVisits = (member_id: number) => {
        return this._http.get(this.url + `guests/${member_id}/check_visits`,{ headers: this.headers })
                          .map(res => res.json());
    }

    registerVisit = (member_id: number, data: any) => {
        return this._http.post(this.url + `guests/${member_id}/register_visit`, data, { headers: this.headers })
                         .map(res => res.json());
    }

    getData = (query: string) => {
        let url = this.url + lscache.get('table') + query;
        console.log("querying: " + url);
        return this._http.get(url, { headers: this.headers });
    }
 }
