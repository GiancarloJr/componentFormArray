import { Injectable, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from '../models/componente';
import { HttpServiceService } from '../shared/httpService/httpService.service';


@Injectable({
  providedIn: 'root'
})
export class CadastroService extends HttpServiceService implements OnInit{

  private endPoint = 'Componentes'

  constructor(protected override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  public getComponents(endpoint: string): Observable<Componente[]> {
    return this.httpGet(`${endpoint}`);
  }

  public saveComponente(endpoint: string,payload: Componente): Observable<Componente> {
    return this.httpPost(`${endpoint}`, payload);
  }

  public deleteComponente(endpoint: string,id: number): Observable<Componente> {
    return this.httpDelete(`${endpoint}/${id}`);
  }

  public editarComponente(endpoint: string,payload: Componente): Observable<Componente> {
    return this.httpPut(`${endpoint}/${payload.id}`, payload);
  }

  public getPostsById(id: number): Observable<Componente> {
    return this.httpGet(`${this.endPoint}/${id}`);
  }

}
