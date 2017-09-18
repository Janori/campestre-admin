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

  getMember = (id: number) => {
      return this._http.get(this.url + `members/${id}`, { headers: this.headers })
                       .map(res => res.json());
  }

  updateUser = (id, data) => {
    let headers = this.headers;
    return this._http.put(this.url + `members/${id}`, data,{ headers: this.headers })
                     .map(res => res.json());
  }
}
