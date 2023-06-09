import { Injectable, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Componente } from '../models/componente';
import { HttpServiceService } from '../shared/httpService/httpService.service';


@Injectable({
  providedIn: 'root'
})
export class CadastroService extends HttpServiceService implements OnInit{

  private endPoint = 'table'

  constructor(protected override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
  }

  public getPosts(): Observable<Componente[]> {
    return this.httpGet(`${this.endPoint}?_sort=views&_order=asc`);
  }

  public savePosts(payload: Componente): Observable<Componente> {
    return this.httpPost(`${this.endPoint}`, payload);
  }

  public deletePosts(id: number): Observable<Componente> {
    return this.httpDelete(`${this.endPoint}/${id}`);
  }

  public editarPosts(payload: Componente): Observable<Componente> {
    return this.httpPut(`${this.endPoint}/${payload.id}`, payload);
  }

  public getPostsById(id: number): Observable<Componente> {
    return this.httpGet(`${this.endPoint}/${id}`);
  }

}
