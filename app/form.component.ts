import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Event }             from './event';
import { Query }             from './query';
import { EventService }      from './event.service';

@Component({
    selector: 'app-form',
    templateUrl: 'form.component.html'
})
export class FormComponent implements OnInit {
    query: Query;
    events: Event[];

    constructor(
        private eventService: EventService,
        private router: Router
    ) { }

    getEvents(){
        this.eventService
            .getEvents(this.query)
            .subscribe(
                (res: any) => this.events = res.events,
                (err: any) => {
                    alert(err);
                });
    }

    clearFields(): void {
        this.query = {
            apiKey: "",
            logKeys: [""],
            queryString: "",
            startTime: 0,
            endTime: 0,
        };
    }

    ngOnInit() {
        this.clearFields();
        this.events = [
            {
                logs: {}
            }
        ]
    }
}