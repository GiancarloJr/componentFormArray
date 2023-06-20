// Angular
import { NgModule } from '@angular/core';

// Local
import { DocTableDiretivasComponent } from './tablediretivas.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    DocTableDiretivasComponent
  ],
  imports: [
    // Library
		ReactiveFormsModule,
		MatFormFieldModule,
		MatIconModule,

    // Local
		BrowserModule
  ],
  exports: [
    DocTableDiretivasComponent
  ]
})
export class DocTableDiretivasModule { }
