import { map } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { Dados } from './../../models/componente';
import { CadastroService } from './../../servicedoc/cadastro.service';
// Angular
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Local
import { Componente } from '../../models/componente';
import { DialogConfirm } from './dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'doc-tablediretivas',
  templateUrl: './tablediretivas.component.html',
  styleUrls: ['./tablediretivas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocTableDiretivasComponent implements OnInit {

  //#region Properties/Inputs/ViewChild

  @Input() nameComponent: string;

  private readonly sectionType: string = "Decorators";

  public formData!: FormGroup;
  private formDataComponent!: FormGroup;

  public disabledButtonAddRow: boolean = false;
  public disabledButtonExclude: boolean = true;
  public disabledButtonEdit: boolean = false;
  public disabledButtonSave: boolean = true;
  public disabledButtonAddTable: boolean = false;

  componenteId: number = 1;

  //#endregion

  //#region Construtor

  constructor(private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private cadastroService: CadastroService) {
  }

  //#endregion

  //#region Life Cycles

  ngOnInit(): void {
    this.createForm();
    this.initializeData();
  }

  //#endregion

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
    this.disableInput();
  }

  buttonExcludeRow(): void {
    this.disabledButtonSave ? this.disabledButtonSave = false : this.disabledButtonSave = true;
    this.disabledButtonEdit ? this.disabledButtonEdit = false : this.disabledButtonEdit = true;
    this.disabledButtonAddRow ? this.disabledButtonAddRow = false : this.disabledButtonAddRow = true;
    this.disabledButtonExclude ? this.disabledButtonExclude = true : this.disabledButtonExclude = false;
  }

  //#endregion

  //#region LEGENDA DOS BOTÕES

  public get tooltipSave(): string {
    return this.formData.valid ? "Clique para Salvar" : "Preenchas todos os campos para salvar";
  }

  //#endregion

  //#region Private Methods

  private createForm(): void {
    this.formData = this._formBuilder.group({
      id: [null],
      ComponenteId: [''],
      Componente: [''],
      Dados: this._formBuilder.array([])
    });

    this.formDataComponent = this._formBuilder.group({
      Id: [''],
      ComponenteId: ['',],
      Descricao: ['', Validators.required],
      Nome: ['', Validators.required],
      SecaoId: [''],
      Secao: ['']
    });
  }

  private createFormGroupDados(dado: Dados): FormGroup {
    return this._formBuilder.group({
      Id: [dado.Id],
      ComponenteId: [dado.ComponenteId],
      Descricao: [dado.Descricao, [Validators.required]],
      Nome: [dado.Nome, [Validators.required]],
      SecaoId: [dado.SecaoId],
      Secao: [dado.Secao]
    })
  }

  private orderDadosById(dados: Dados[]): Dados[] {
    return dados.sort(
      function (a, b) {
        return a.Id - b.Id;
      });
  }

  //#endregion

  //#region Public Methods

  // Montagem do(s) ARRAY(s) com as informações do componente
  public initializeData(): void {
    let dados = this.formData.get('Dados') as FormArray;
    this.cadastroService.getComponents("Componentes").subscribe(response => {
      let dadosComponente: Componente = response.filter(value => value.Componente == this.nameComponent).at(0);
      // Pega o primeiro elemento/tabela (já informado como parâmetro no get 'Componentes)
      // e filtra pelo Id da Seção, informado na propriedade 'componenteId'
      dadosComponente.Dados.filter(value => value.Secao == this.sectionType).forEach(element => {
        // Alimento o form group do array (Dados)
        // Incremento no array que alimentará o formgroup principal
        dados.push(this.createFormGroupDados(element));
      });
    })
  }

  public trackbyFn(index: number, item: any) {
    return item.Id;
  }

  //#endregion

  // Metodo para exclusão de linha da tabela
  public removeRow(index: number) {
    const dialogref = this.dialog.open(DialogConfirm)
    let dados = this.formData.get('Dados') as FormArray;
    dialogref.afterClosed().subscribe(ret => {
      if (ret) {
        this.cadastroService.getComponents("Componentes").subscribe(response => {
          let dataUpdate: Componente = response.filter(element => element.Componente == this.nameComponent).at(0);
          dataUpdate.Dados = dataUpdate.Dados.filter(value => value.Id != dados.value[index].Id);
          this.cadastroService.putComponents("Componentes", dataUpdate).subscribe(ret => {
            this.ngOnInit();
            this.buttonEditRow();
          });
        });
      }
    });
  }

  // Metodo para adicionar linha e gerar novo Id no banco
  public addRow(): void {
    this.buttonAddRow();
    const dados = this.formData.get('Dados') as FormArray;
    this.cadastroService.getComponents("Componentes").subscribe(response => {
      let componente: Componente = response.filter(element => element.Componente == this.nameComponent).at(0);
      let lastId = componente.Dados.reverse().at(0).Id + 1;
      dados.push(this._formBuilder.group({
        Id: [lastId],
        ComponenteId: [componente.ComponenteId],
        Descricao: ['', [Validators.required]],
        Nome: ['', [Validators.required]],
        SecaoId: [1],
        Secao: [this.sectionType]
      }))
    })
  }

  // Metodo Salvar Formulario
  public onSubmit(): void {

    if (this.formData.valid) {
      this.cadastroService.getComponents("Componentes").subscribe(response => {

        let componente: Componente = response.filter(element => element.Componente == this.nameComponent).at(0);

        componente.Dados = componente.Dados.filter(value => value.Secao != this.sectionType); //ARRAY DE DADOS QUE NÃO PERTENCE A SEÇÃO

        componente.Dados.push.apply(componente.Dados, this.formData.value.Dados);

        componente.Dados = this.orderDadosById(componente.Dados);

        this.cadastroService.putComponents("Componentes", componente).subscribe(ret => {
          this.buttonEditRow();
          this.ngOnInit();
        });
      });
    }
  }

  isEmpty(value: string): boolean {
    return value === '';
  }

  errorMessageIsEmpty(): string {
    return "CAMPO NÃO DEVE SER VAZIO";
  }

  public formValid(): boolean {
    return this.formData.valid;
  }

  public enableEdit(event: Event) {
    return this.disabledButtonEdit ? event : event.preventDefault();
  }

  private disableInput(): void {
    if (this.disabledButtonEdit) {
      (<FormArray>this.formData.get('Dados')).controls.forEach(value => value.enable())
    } else {
      (<FormArray>this.formData.get('Dados')).controls.forEach(value => value.disable());
    }
  }

}
