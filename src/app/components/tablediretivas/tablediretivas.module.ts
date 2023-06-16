// Angular
import { NgModule } from '@angular/core';

// Local
import { CommomModules, MaterialModules } from 'projects/virtue/lib/modules/public-api';
import { DocTableDiretivasComponent } from './tablediretivas.component';

@NgModule({
  declarations: [
    DocTableDiretivasComponent
  ],
  imports: [
    // Library
    CommomModules,
    MaterialModules

    // Local

  ],
  exports: [
    DocTableDiretivasComponent
  ]
})
export class DocTableDiretivasModule { }
