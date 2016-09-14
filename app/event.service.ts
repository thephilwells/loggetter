import { Injectable } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';

import { Event } from './event';
import { Query } from './query';

@Injectable()
export class EventService {
    private headers: Headers;
    private apiKey: string;

    constructor(private http: Http) { }

    getEvents(query: Query): Observable<Object> {
        this.apiKey = query.apiKey;

        this.headers = new Headers({
            'Content-Type': 'application/json',
            'x-api-key': query.apiKey
        });
        let startEpoch = this.convertTime(query.startTime);
        let endEpoch = this.convertTime(query.endTime);
        let queryUrl = `https://rest.logentries.com/query/logs/${query.logKeys[0]}/?query=${query.queryString}&from=${startEpoch}&to=${endEpoch}`;

        let options = new RequestOptions({ headers: this.headers });
        let totalResponse = this.http.get(queryUrl, options)
            .map((res: Response) => this.handleResponse(res.json())
                .catch((error: any) => Observable.throw(error.json().error || 'Server error')));
        return totalResponse;
    }

    private getEventsFromContinueUrl(url: string): Observable<Object> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
        });
        let queryUrl = url;

        let options = new RequestOptions({ headers: this.headers });
        let totalResponse = this.http.get(queryUrl, options)
                .map((res: Response) => { 
                    return {
                        response: this.handleResponse(res.json())
                        };
                })
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
        return totalResponse;
    }

    private handleResponse(firstResponse: any): any {
        let response = firstResponse;
        if (response.links) {
            this.continueRequest(response);
            return;
        } else if (response.events) {
            return response;
        } else {
            alert('API responded with ${response.status_code}');
            return;
        };
    }

    private continueRequest(response: any) {
        if (response.links) {
            let continueUrl = response.links[0].href;
            let newResponse = this.getEventsFromContinueUrl(continueUrl)
                .map((res: Response) => this.handleResponse(res.json()));
        }
    }

    private convertTime(time: number): number {
        // do some magic here to convert a timestamp to an epoch
        return time;
    }

    private handleError(error: any): Promise<any> {
        alert('An error occurred: ' + error);
        return Promise.reject(error.message || error);
    }
}