import { Component, Input, ViewEncapsulation } from '@angular/core';

import { CadastroService } from 'src/app/services/cadastro.service';

import { Componente } from 'src/app/models/componente';
import { DialogAnimationsExampleDialog } from './dialog-confirm/dialog-confirm.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { decoratorObject } from 'src/app/models/decoratorArray.interface';

@Component({
  selector: 'app-component-teste-db',
  templateUrl: './component-teste-db.component.html',
  styleUrls: ['./component-teste-db.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComponentTesteDBComponent{

  public formData!: FormGroup;
  public formItem!: FormGroup;
  formComponente!: FormGroup;
  formDecorator!: FormGroup;
  componentitle: string = 'Button Speed Dial';
  disabledButtonAddRow: boolean = false;
  disabledButtonExclude: boolean = true;
  disabledButtonEdit: boolean = false;
  disabledButtonSave: boolean = true;
  disabledButtonAddTable: boolean = false;

  constructor(private _formBuilder: FormBuilder,
    private cadastroService: CadastroService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.cadastroService.getPosts().subscribe((data) => {
      this.initializeForm(data);
    });
  }

	//#region METODOS BOTOES

		buttonAddRow(): void {
			this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
			this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
			this.disabledButtonAddRow ? this.disabledButtonAddRow = false : this.disabledButtonAddRow = true;
			this.disabledButtonExclude ? this.disabledButtonExclude = false : this.disabledButtonExclude = true;
			this.disabledButtonAddTable ? this.disabledButtonAddTable = false : this.disabledButtonAddTable = true;
		}

		buttonEditRow(): void {
			this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
			this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
			this.disabledButtonAddRow ? this.disabledButtonAddRow = false : this.disabledButtonAddRow = true;
			this.disabledButtonExclude ? this.disabledButtonExclude = false : this.disabledButtonExclude = true;
			this.disabledButtonAddTable ? this.disabledButtonAddTable = false : this.disabledButtonAddTable = true;
		}

		buttonExcludeRow(): void {
			this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
			this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
			this.disabledButtonAddRow ? this.disabledButtonAddRow = false : this.disabledButtonAddRow = true;
			this.disabledButtonExclude ? this.disabledButtonExclude = true : this.disabledButtonExclude = false;
		}

		buttonAddTable(): void {
			this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
			this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
			this.disabledButtonAddTable ? this.disabledButtonAddTable = false : this.disabledButtonAddTable = true;
			this.disabledButtonExclude ? this.disabledButtonExclude = false : this.disabledButtonExclude = true;
			this.disabledButtonAddRow ? this.disabledButtonAddRow = false : this.disabledButtonAddRow = true;
		}

		//#endregion

  //#region  CRIANDO FORMULARIOS




  // initializeForm(data: Componente[]): void {

  //   const components = data.map(comp => {

  //     const arrayInput = comp.arrayInput.map(input => {
  //       return this._formBuilder.group({
  //         decorator: [input.decorator, [Validators.required]],
  //         explicacaoDecorator: [input.explicacaoDecorator, [Validators.required]]
  //       });
  //     });

  //     return this._formBuilder.group({
  //       id: comp.id,
  //       arrayInput: this._formBuilder.array(arrayInput)
  //     });
  //   }
  //   );

  //   this.formComponente = this._formBuilder.group({
  //     components: this._formBuilder.array(components)
  //   });
  // }

	initializeForm(data: Componente[]): void {

    this.formComponente = this._formBuilder.group({
      components: this.createComponentForm(data)
    });
  }


	private createDecoratorForm(objDec: decoratorObject = { decorator: "", explicacaoDecorator: ""}){
		return this._formBuilder.group({
			decorator: [objDec.decorator],
			explicacaoDecorator: [objDec.explicacaoDecorator]
		})
	}

	private createComponentForm(data: Componente[]): FormArray{
		return new FormArray(data.map(comp => {
      return this._formBuilder.group({
        id: comp.id,
        arrayInput: this._formBuilder.array(comp.arrayInput.map(input => this.createDecoratorForm(input)))
      });
    }
    ));
	}

  get components(): FormArray {
    return this.formComponente.get('components') as FormArray;
  }

  public items(index: number): FormArray {
    return this.components.at(index).get('arrayInput') as FormArray;
  }

  //#endregion

  //#region LEGENDA DOS BOTÕES

  get tooltipSave(): string {
    return this.formComponente.valid ? "Clique para Salvar" : "Preenchas todos os campos para salvar";
  }

  get tooltipAddTable(): string {
    return "Adicionar nova tabela";
  }

  //#endregion

  //#region FUNÇÕES ADICIONAR LINHA

  addRow(empIndex: number) {
    this.buttonAddRow();
    this.items(empIndex).push(this._formBuilder.group({
      decorator: ['', [Validators.required]],
      explicacaoDecorator: ['', [Validators.required]]
    }));
  }

  //#endregion

  //#region ADICIONA NOVA TABELA

  addTable() {
    this.components.push(this._formBuilder.group({
      arrayInput: new FormArray([this._formBuilder.group({
        decorator: ['', [Validators.required]],
        explicacaoDecorator: ['', [Validators.required]]
      })
      ])
    }));
    this.buttonAddTable();
  }

  //#endregion

  //#region REMOVER LINHA DA TABELA

  removeRow(empIndex: number, decoratorIndex: number, payload: Componente) {
    const dialogref = this.dialog.open(DialogAnimationsExampleDialog)

    dialogref.afterClosed().subscribe(ret => {
      if (ret) {
        this.items(empIndex).removeAt(decoratorIndex);
        if (this.items(empIndex).length === 0) {
          this.removeTable(Number(payload.id));
          this.ngOnInit();
          this.buttonEditRow();
        }
      }
    });
  }

  //#endregion

  //#region INICIA FORMULARIO

  private createForm(): void {
    this.formComponente = this._formBuilder.group({
      components: this._formBuilder.array([])
    });
  }

  //#endregion

  //#region SALVAR TABELA DE FORMA INDEPENDENTE

  onSubmit(payload: Componente) {
    if (!this.formComponente.valid)
      return;
    if (payload.arrayInput.length == 0) {
      this.removeTable(Number(payload.id));
      this.ngOnInit();
    } else {
			console.log(payload.id === undefined);

      if (payload.id === undefined) { // CASO TABELA NOVA TENHA SIDO CRIADA E ID VEM UNDEFINED ENTAO VAI DIRETO PRO 'POST' E UTILIZA METODO SAVE
        this.buttonEditRow()
				this.cadastroService.savePosts(payload).subscribe(data => {
          this.ngOnInit();
        });
      } else {
        this.buttonEditRow()
				console.log('teste');
        this.cadastroService.editarPosts(payload).subscribe(data => {
          this.ngOnInit();
        })
      }
    }
  }

  //#endregion

  //#region REMOVE TABELA DO BANCO

  removeTable(id: number) {
    this.cadastroService.deletePosts(id).subscribe(data => {
      this.ngOnInit();
      this.buttonEditRow();
    })
  }

  //#endregion

  //#region METODO CHAMAR DIALOGO PARA CONFIRMAÇÃO DE EXCLUSÃO

  openDialog(): void {
    this.dialog.open(DialogAnimationsExampleDialog, {
      width: '400px'
    });
  }

  //#endregion


  isEmpty(value: string): boolean {
    return value === '';
  }

	errorMessageIsEmpty(): string {
		return "CAMPO NÃO DEVE SER VAZIO";
	}

}



