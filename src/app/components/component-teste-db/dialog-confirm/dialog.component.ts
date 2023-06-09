import { Component, EventEmitter, Input, Output } from "@angular/core";
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-confirm.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogAnimationsExampleDialog {

  @Output() removeDecorator = new EventEmitter();

  onClick(result: boolean): void {
    this.dialogRef.close(result);
  }

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>) {}
}
