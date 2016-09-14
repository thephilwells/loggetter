import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent }  from './app.component';
import { FormComponent } from './form.component';
import { OutputComponent } from './output.component';
import { EventService }  from './event.service';
import { routing }       from './app.routing';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    exports: [],
    declarations: [
        AppComponent,
        FormComponent,
        OutputComponent
    ],
    providers: [
        EventService
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
