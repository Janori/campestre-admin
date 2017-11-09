import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Service } from './Service';

import 'rxjs/add/operator/map';

@Injectable()
export class ReportService extends Service {

    constructor(private _http: Http) { super(); }

    generateReportData = (url: string) => {
        return this._http.get(this.url + 'reports/' + url, { headers: this.headers })
                         .map(res => res.json());
    }
}
