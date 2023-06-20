export interface Resource {
  Badge: number;
  Expanded: boolean;
  Icone: string;
  Id: string;
  Locales: any;
  RecursoID: string;
  Recursos?: Resource[];
  Tipo: number;
  Titulo: string;
  ToolTip: string;
  Url: string;
}
