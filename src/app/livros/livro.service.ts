import { Livro } from './livro.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable ({
	providedIn: 'root'
})

export class LivroService {

	private listaLivrosAtualizada = new Subject < Livro [] > ();
	private livros: Livro [] = [];

	getLivros (): Livro [] {
		return [...this.livros];
	}

	adicionarLivro (id: string, titulo: string, autor: string, qntd_paginas: string) {

		const livro: Livro = {
			id: id,
			titulo: titulo,
			autor: autor,
			qntd_paginas: qntd_paginas
		}

		this.livros.push (livro);
		this.listaLivrosAtualizada.next ([...this.livros]);
	}

	getListaLivrosAtualizadaObservable () {
		return this.listaLivrosAtualizada.asObservable ();
	}
}
