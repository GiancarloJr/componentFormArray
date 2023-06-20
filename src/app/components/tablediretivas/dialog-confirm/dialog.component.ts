import { Component, Inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogModule } from "@virtuetec/lib/components";


@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'dialog-confirm.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, DialogModule],
})
export class DialogConfirm {

  public messageTitle: string;

  onClick(result: boolean): void {
    this.dialogRef.close(result);
  }

  constructor(private dialogRef: MatDialogRef<DialogConfirm>,
    @Inject(MAT_DIALOG_DATA) data) {
      this.messageTitle = data.messageTitle;
  }
}
