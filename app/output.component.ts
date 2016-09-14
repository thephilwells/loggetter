import { Component, Input } from '@angular/core';

import { Event } from './event';

@Component ({
    selector: 'output-field',
    template: `
        <div *ngFor="let log of events.logs"></div>
    `,
    styleUrls: ['output.component.css']
})

export class OutputComponent {
    @Input('events') events: Event[];
}