import { Component, EventEmitter, Output } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';


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
