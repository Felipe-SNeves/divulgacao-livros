import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Livro } from '../livro.model';

@Component({
  	selector: 'app-livro-inserir',
  	templateUrl: './livro-inserir.component.html',
  	styleUrls: ['./livro-inserir.component.css']
})

export class LivroInserirComponent implements OnInit {

	@Output () livroAdicionado = new EventEmitter<Livro> ();

	id: string;
	titulo: string;
	autor: string;
	qntd_paginas: string;

	onAdicionarLivro () {
		const livro: Livro = {
			id: this.id,
			titulo: this.titulo,
			autor: this.autor,
			qntd_paginas: this.qntd_paginas,
		};
		this.livroAdicionado.emit(livro);
		this.id = "";
		this.titulo = "";
		this.autor = "";
		this.qntd_paginas = "";
	}

	constructor() { }

  	ngOnInit(): void {
  	}

}
