import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JustAskEvieProfileGridComponent } from './justaskevie-profile-grid/justaskevie-profile-grid.component';
import { JustAskEvieProfileService } from './services/justaskevie-profile.service';

@NgModule({
  declarations: [
    AppComponent,
    JustAskEvieProfileGridComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [JustAskEvieProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
