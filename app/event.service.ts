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
    public events: Event[] = [];

    constructor(private http: Http) { }

    getEvents(query: Query): Observable<Event[]> {
        this.apiKey = query.apiKey;

        this.headers = new Headers({
            'Content-Type': 'application/json',
            'x-api-key': query.apiKey
        });
        let startEpoch = this.convertTime(query.startTime);
        let endEpoch = this.convertTime(query.endTime);
        let queryUrl = `https://rest.logentries.com/query/logs/${query.logKeys[0]}/?query=${query.queryString}&from=${startEpoch}&to=${endEpoch}`;

        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(queryUrl, options)
            .flatMap((res: Response) => this.handleResponse(res.json()))
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    private getEventsFromContinueUrl(url: string): Observable<Event[]> {
        this.headers = new Headers({
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey
        });
        let queryUrl = url;

        let options = new RequestOptions({ headers: this.headers });
        return this.http.get(queryUrl, options)
                .flatMap((res: Response) => this.handleResponse(res.json()))
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    private handleResponse(initialResponse: any): Observable<Event[]> {
        let response = initialResponse;
        if (response.links) {
            this.continueRequest(response);
            return;
        } else if (response.events) {
            this.events.push(response.events);
            return;
        } else {
            alert('API responded with ${response.status_code}');
            return;
        };
    }

    private continueRequest(response: any): Observable<Event[]> {
        if (response.events) {
            this.events.push(response.events);
        }
        if (response.links) {
            let continueUrl = response.links[0].href;
            return this.getEventsFromContinueUrl(continueUrl);
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