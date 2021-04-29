import { Livro } from './livro.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable ({
	providedIn: 'root'
})

export class LivroService {

	private listaLivrosAtualizada = new Subject < Livro [] > ();
	private livros: Livro [] = [];

	constructor (private httpClient: HttpClient) {
	}

	getLivros (): void {
	this.httpClient.get <{mensagem: string, livros: any}> ('http://192.168.0.74:3000/api/livros').pipe(map((dados) => {
	
		return dados.livros.map ((livro) => {
			return {
				id: livro._id,
				titulo: livro.titulo,
				autor: livro.autor,
				qntd_paginas: livro.qntd_paginas
			}
		})
	})).subscribe (

			(livros) => {
				this.livros = livros;
				this.listaLivrosAtualizada.next ([...this.livros]);
			}
		)
	}

	adicionarLivro (titulo: string, autor: string, qntd_paginas: string) {

		const livro: Livro = {
			id: null,
			titulo: titulo,
			autor: autor,
			qntd_paginas: qntd_paginas
		};

		this.httpClient.post<{mensagem: string, id: string}> ('http://192.168.0.74:3000/api/livros',livro).subscribe((dados) => {
				console.log (dados.mensagem);
				livro.id = dados.id;
				this.livros.push (livro);
				this.listaLivrosAtualizada.next ([...this.livros]);
			}					 
		)

	}

	getListaLivrosAtualizadaObservable () {
		return this.listaLivrosAtualizada.asObservable ();
	}

	removerLivro (id: string): void {
		//console.log ('192.168.0.74:3000/api/livros/' + id);
		this.httpClient.delete('http://192.168.0.74:3000/api/livros/' + id).subscribe(
			() => {
				this.livros = this.livros.filter ((liv) => {
					return liv.id !== id;
				});
				this.listaLivrosAtualizada.next([...this.livros]);
			}
		);
	}
}
