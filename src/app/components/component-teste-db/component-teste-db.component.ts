import { Component, ViewEncapsulation } from '@angular/core';

import { CadastroService } from 'src/app/services/cadastro.service';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Componente } from 'src/app/models/componente';
import { DialogAnimationsExampleDialog } from './onSubmitDialog/dialog.component';

@Component({
  selector: 'app-component-teste-db',
  templateUrl: './component-teste-db.component.html',
  styleUrls: ['./component-teste-db.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentTesteDBComponent {

  public formData!: FormGroup;
  public formItem!: FormGroup;
  formComponente!: FormGroup;
  formDecorator!: FormGroup;
  disabled: boolean = true;
  componentitle: string = 'Button Speed Dial';
  disabledButtonAdd: boolean = false;
  disabledButtonExclude: boolean = true;
  disabledButtonEdit: boolean = false;
  disabledButtonSave: boolean = true;




  //#region METODOS BOTOES

  buttonEditRow(): void {
    this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
    this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
    this.disabledButtonAdd ? this.disabledButtonAdd = false : this.disabledButtonAdd = true;
    this.disabledButtonExclude ? this.disabledButtonExclude = false : this.disabledButtonExclude = true;
  }

  buttonExcludeRow(): void {
    this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
    this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
    this.disabledButtonAdd ? this.disabledButtonAdd = false : this.disabledButtonAdd = true;
    this.disabledButtonExclude ? this.disabledButtonExclude = true : this.disabledButtonExclude = false;
  }

  //#endregion

  constructor(private _formBuilder: FormBuilder,
    private cadastroService: CadastroService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.cadastroService.getPosts().subscribe((data) => {
      this.initializeForm(data);
    });
  }

  //#region

  // FUNCIONANDO

  initializeForm(data: Componente[]): void {

    const components = data.map(comp => {

      const arrayInput = comp.arrayInput.map(input => {
        return this._formBuilder.group({
          decorator: [input.decorator, [Validators.required]],
          explicacaoDecorator: [input.explicacaoDecorator, [Validators.required]]
        });
      });

      return this._formBuilder.group({
        id: comp.id,
        nomeComponent: comp.nomeComponent,
        explicacaoComponent: comp.explicacaoComponent,
        arrayInput: this._formBuilder.array(arrayInput),
        explicacaoTest1: comp.explicacaoTest1,
        explicacaoTest2: comp.explicacaoTest2
      });
    }
    );

    this.formComponente = this._formBuilder.group({
      components: this._formBuilder.array(components)
    });
  }

  get components(): FormArray {
    return this.formComponente.get('components') as FormArray;
  }

  get tooltipSave(): string {
    return this.formComponente.valid ? "Clique para Salvar" : "Preenchas todos os campos para salvar";
  }

  public items(index: number): FormArray {
    return this.components.at(index).get('arrayInput') as FormArray;
  }

  addDecorator(empIndex: number) {
    this.buttonExcludeRow();

    this.items(empIndex).push(this._formBuilder.group({
      decorator: ['', [Validators.required]],
      explicacaoDecorator: ['', [Validators.required]]
    }));
  }

  removeDecorator(empIndex: number, decoratorIndex: number) {
    const dialogref = this.dialog.open(DialogAnimationsExampleDialog)

    dialogref.afterClosed().subscribe(ret => {
      if (ret) {
        this.items(empIndex).removeAt(decoratorIndex);
      }
    });
  }

  //#endregion

  //#region Tentativa

  private createForm(): void {
    this.formComponente = this._formBuilder.group({
      components: this._formBuilder.array([])
    });

  }
  //#endregion

  //#region SALVAR FORMULARIO DE FORMA INDEPENDENTE
  onSubmit(payload: Componente) {
    if (!this.formComponente.valid)
      return;

    this.buttonEditRow()
    this.cadastroService.editarPosts(payload).subscribe(data => {
      this.ngOnInit();
    }
    )
  }
  //#endregion

  excluir(id: number) {
    this.cadastroService.deletePosts(id).subscribe(data => {
    })
  }

  getMessage() {
    return "error Email";
  }

  openDialog(): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '400px'
    });
  }
}

