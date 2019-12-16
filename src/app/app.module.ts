import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';

import {
  MatButtonModule,
  MatDialogModule,
  MatMenuModule,
  MatIconModule,
  MatGridListModule,
  MAT_DIALOG_DEFAULT_OPTIONS
} from '@angular/material';

import { DiskCountService } from './models/services/disk-count.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent, GameOverDialog } from './components/canvas/canvas.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameProgressComponent } from './components/game-progress/game-progress.component';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    GameOverDialog,
    SettingsComponent,
    GameProgressComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatIconModule,
    MatGridListModule
  ],
  entryComponents: [
    GameOverDialog
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}},
    DiskCountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
