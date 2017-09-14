import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Service } from './Service';
// import { User } from '../model';
import 'rxjs/add/operator/map';

@Injectable()
export class PartnerService extends Service {

  constructor(private _http: Http) {
    super();
  }

  getAll = () => {
      let headers = this.headers();
      return this._http.get(this.url + 'members?from=0&count=6000', { headers })
                       .map(res => res.json());
  }

  updateUser = (id, data) => {
    let headers = this.headers();
    return this._http.put(this.url + `members/${id}`, data,{ headers })
                     .map(res => res.json());
  }
}
