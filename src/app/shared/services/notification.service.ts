import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Service } from './Service';
import { IService } from './iservice';

@Injectable()
export class NotificationService extends Service  implements IService {

    constructor(private _http: Http) {
        super();
    }

    getData = (query: string) => {
        let url = this.url + 'notifications' + query;
        console.log("querying: " + url);
        return this._http.get(url, { headers: this.headers });
    }

    createNotification(data: any) {
        return this._http.post(this.url + 'notifications', data, { headers: this.headers })
                         .map(res => res.json());
    }

    editNotification(id: number, data: any) {
        return this._http.put(this.url + 'notifications/'  + id, data, { headers: this.headers })
                         .map(res => res.json());
    }

    deleteNotification(id: number) {
        return this._http.delete(this.url + 'notifications/'  + id, { headers: this.headers})
                         .map(res => res.json());
    }

    eraseImage(url: string) {
        let data = { url: url};
        return this._http.post(this.url + 'notifications/image/delete', data, { headers: this.headers })
                         .map(res => res.json());
    }

    uploadImage(formData: any) {
        let headers = new Headers();
            headers.append('Content-Type', 'multipart/form-data');
            headers.append('Accept', 'application/json');
            headers.append('Authorization', lscache.get('authToken'));

        return this._http.post(this.url + 'notifications/image/store', formData, headers)
                         .map(res => res.json());
    }
}
