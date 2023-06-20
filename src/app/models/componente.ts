export class Componente {
  id!: number;
  ComponenteId: number = 0;
  Componente: string = '';
  Dados: Dados[] = [];

}

export class Dados {
  Descricao: string = '';
  Nome: string = '';
  SecaoId: number = 0;
  Secao: string = '';
  Id: number = 0;
  ComponenteId: number = 0;
}
