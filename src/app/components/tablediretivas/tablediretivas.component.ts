import { FormGroup } from '@angular/forms';
import { Dados } from './../../models/componente';

// Angular
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

// Local
import { CadastroService } from 'src/app/services/cadastro.service';
import { Componente } from '../../models/componente';

@Component({
  selector: 'doc-tablediretivas',
  templateUrl: './tablediretivas.component.html',
  styleUrls: ['./tablediretivas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DocTableDiretivasComponent implements OnInit {

  //#region Properties/Inputs/ViewChild

  @Input() nameComponent!: string;

  @Input() sectionType!: string;


  private formDataComponent!: FormGroup;

  public formData!: FormGroup;

  public disabledButtonAddRow: boolean = false;
  public disabledButtonExclude: boolean = true;
  public disabledButtonEdit: boolean = false;
  public disabledButtonSave: boolean = true;
  public disabledButtonAddTable: boolean = false;

  public teste: boolean = true;

  public disableTable: boolean = true;

  //#endregion

  //#region Construtor

  constructor(private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private cadastroService: CadastroService) {
  }
  //#endregion

  //#region Life Cycles

  ngOnInit(): void {
    this.cadastroService.getComponents(this.returnPathComponent()).subscribe(response => {
      let dataComponente = response.filter(componente => componente.Componente == this.nameComponent).at(0);
      if (dataComponente!.Dados.filter(decorator => decorator.Secao == this.sectionType).length > 0) {
        this.disableTable = false;
      }
    });
    this.createForm();
    this.initializeData();
		(<FormArray>this.formData.get('Dados')).controls.forEach(value => value.disable());
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
      Dados: this._formBuilder.array([], [Validators.required])
    });
    this.formDataComponent = this._formBuilder.group({
      Id: [''],
      ComponenteId: ['',],
      Descricao: [{value: '', disabled: false}, Validators.required],
      Nome: [{value: '', disabled: false}, Validators.required],
      SecaoId: [''],
      Secao: ['']
    });
  }

  private createFormGroupDados(dado: Dados): FormGroup {
    return this._formBuilder.group({
      Id: [dado.Id],
      ComponenteId: [dado.ComponenteId],
      Descricao: [{value: dado.Descricao, disabled: true}, [Validators.required]],
      Nome: [{value: dado.Nome, disabled: true}, [Validators.required]],
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

  public disableInput(): void {
      (<FormArray>this.formData.get('Dados')).controls.forEach(value => value.disable());
  }

  public enableInput(): void {
      return (<FormArray>this.formData.get('Dados')).controls.forEach(value => value.enable());
  }

  private filterComponente(data: Componente[]): Componente {
    return data.filter(element => element.Componente == this.nameComponent).at(0)!;
  }

  private removeItemFromDecoratorsArray(data: Componente, indexForm: number): void {
    let indexToRemove = data.Dados.findIndex(element => element.Id == indexForm);
    data.Dados.splice(indexToRemove, 1);
  }

  private returnPathComponent(): string {
    return "Componentes";
  }

  //#endregion

  //#region Public Methods

  // Montagem do(s) ARRAY(s) com as informações do componente
  public initializeData(): void {
    let dados = this.formData.get('Dados') as FormArray;
    this.cadastroService.getComponents(this.returnPathComponent()).subscribe(response => {
      let dadosComponente: Componente = this.filterComponente(response);
      // Pega o primeiro elemento/tabela (já informado como parâmetro no get 'Componentes)
      // e filtra pelo Id da Seção, informado na propriedade 'componenteId'
      dadosComponente.Dados.filter(value => value.Secao == this.sectionType).forEach(element => {
        // Alimento o form group do array (Dados)
        // Incremento no array que alimentará o formgroup principal
        dados.push(this.createFormGroupDados(element));
      });
    })
  }

  public getDadosFormArray() {
    return (<FormArray>this.formData.get('Dados')).controls
  }

  public trackbyFn(index: number, item: any) {
    return item.Id;
  }

  public isEmpty(value: string): boolean {
    return value === '';
  }

  public errorMessageIsEmpty(): string {
    return "CAMPO NÃO DEVE SER VAZIO";
  }

  public formValid(): boolean {
    return this.formData.valid;
  }

  // Metodo para adicionar linha e gerar novo Id no banco
  public addRow(): void {
    this.buttonAddRow();
    const dados = this.formData.get('Dados') as FormArray;
    this.cadastroService.getComponents(this.returnPathComponent()).subscribe(response => {
      let componente: Componente = this.filterComponente(response);
      const generatedId = componente.Dados.reverse().at(0)!.Id + 1;
      dados.push(this._formBuilder.group({
        Id: [generatedId],
        ComponenteId: [componente.ComponenteId],
        Descricao: ['', [Validators.required]],
        Nome: ['', [Validators.required]],
        SecaoId: [1],
        Secao: [this.sectionType]
      }))
    });
  }

  // Metodo para exclusão de linha da tabela
  // public async removeRow(indexArrayForm: number): Promise<void> {

  //   let arrayDiretivas = this.formData.get('Dados') as FormArray;

  //   let retApi = await this.cadastroService.getComponentsAsync(this.returnPathComponent());
  //   let componenteUpdate: Componente = this.filterComponente(retApi);

  //   //FILTRAR DIRETIVAS CORRESPONDENTE AO COMPONENTE
  //   componenteUpdate.Dados = componenteUpdate.Dados.filter(decorator => decorator.Secao == arrayDiretivas.value[indexArrayForm].Secao);

  //   const dialogConfig = new MatDialogConfig();
  //   let messageTitleA = componenteUpdate.Dados.length > 1 ? "Tem certeza que deseja remover o item?" : "Tabela com apenas um item, deseja remover tabela?";

  //   dialogConfig.data = {
  //     messageTitle: messageTitleA
  //   };
  //   const dialogRetorno = this.dialog.open(DialogConfirm, dialogConfig);
  //   dialogRetorno.afterClosed().subscribe(ret => {
  //     if (ret) {
  //       this.cadastroService.getComponents(this.returnPathComponent()).subscribe(response => {
  //         let componenteUpdate: Componente = this.filterComponente(response);
  //         this.removeItemFromDecoratorsArray(componenteUpdate, arrayDiretivas.value[indexArrayForm].Id);
  //         this.cadastroService.putComponents(this.returnPathComponent(), componenteUpdate).subscribe(ret => {
  //           this.ngOnInit();
  //           this.buttonEditRow();
  //         });
  //       });
  //     }
  //   });
  // }

  // Metodo Salvar Formulario
  public onSubmit(): void {
    if (this.formData.valid) {
      this.cadastroService.getComponents(this.returnPathComponent()).subscribe(response => {
        let componente: Componente = this.filterComponente(response);
        componente.Dados = componente.Dados.filter(value => value.Secao != this.sectionType); //ARRAY DE DADOS QUE NÃO PERTENCE A SEÇÃO
				//HABILITAR CAMPO TEXTAREA DO FORMULARIO PARA PEGAR OS DADOS, POIS SE TIVER DESABILITADO NÃO É POSSIVEL
				//PEGAR OS DADOS E ATUALIZAR O COMPONENTE
				//FORMULARIO 'DISABLED' NÃO É POSSIVEL PEGAR OS DADOS
				this.enableInput();
        componente.Dados.push.apply(componente.Dados, this.formData.value.Dados);
				//BLOQUEANDO FORMULARIO NOVAMENTE
				this.disableInput();
        this.cadastroService.editarComponente(this.returnPathComponent(), componente).subscribe(ret => {
					console.log(2,ret);
          this.ngOnInit();
          this.buttonEditRow();
        });
      });
    }
  }
  //#endregion

}
