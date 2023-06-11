import { Component, OnInit } from '@angular/core';
import { CadastroService } from './services/cadastro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit{
  title = 'markdown-editor';

	dataSource: any[] = [];

	constructor(private cadastroService: CadastroService) { }
	ngOnInit(): void {
		this.cadastroService.getPosts().subscribe(data => {
			this.dataSource = data;
			console.log(1, this.dataSource);

		});
	}
}
