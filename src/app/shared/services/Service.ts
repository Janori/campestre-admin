import { Headers } from '@angular/http';

declare var lscache: any;

export class Service {
    public url: string;

    constructor() {
        /*if(!/localhost/.test(document.location.host))
            this.url = 'http://system.campestrecelaya.mx/api/'; // prod
        else*/
            this.url = 'http://system.campestrecelaya.mx/api/'; // test
    }

    get headers() {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");

        if(lscache.get('authToken') !== null)
            headers.append("Authorization", lscache.get('authToken'));

        return headers;
    }
}
