import { Livro } from './livro.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable ({
	providedIn: 'root'
})

export class LivroService {

	private listaLivrosAtualizada = new Subject < Livro [] > ();
	private livros: Livro [] = [];

	constructor (private httpClient: HttpClient) {
	}

	getLivros (): void {
		this.httpClient.get <{mensagem: string, livros: Livro []}> ('http://192.168.0.60:3000/api/livros').subscribe (

			(dados) => {
				this.livros = dados.livros;
				this.listaLivrosAtualizada.next ([...this.livros]);
			}
		)
	}

	adicionarLivro (id: string, titulo: string, autor: string, qntd_paginas: string) {

		const livro: Livro = {
			id: id,
			titulo: titulo,
			autor: autor,
			qntd_paginas: qntd_paginas
		};

		this.httpClient.post<{mensagem: string}> ('http://192.168.0.60:3000/api/livros',
							 livro).subscribe(

			(dados) => {
				console.log (dados.mensagem);
				this.livros.push (livro);
				this.listaLivrosAtualizada.next ([...this.livros]);
			}					 
		)

	}

	getListaLivrosAtualizadaObservable () {
		return this.listaLivrosAtualizada.asObservable ();
	}
}
