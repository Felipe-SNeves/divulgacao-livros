import { Livro } from './livro.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable ({
	providedIn: 'root'
})

export class LivroService {

	private listaLivrosAtualizada = new Subject < Livro [] > ();
	private livros: Livro [] = [];

	constructor (private httpClient: HttpClient, private router: Router) {
	}

	getLivros (): void {
	this.httpClient.get <{mensagem: string, livros: any}> ('http://192.168.0.74:3000/api/livros').pipe(map((dados) => {
	
		return dados.livros.map ((livro) => {
			return {
				id: livro._id,
				titulo: livro.titulo,
				autor: livro.autor,
				qntd_paginas: livro.qntd_paginas,
				imagemURL: livro.imagemURL
			}
		})
	})).subscribe (

			(livros) => {
				this.livros = livros;
				this.listaLivrosAtualizada.next ([...this.livros]);
			}
		)
	}

	adicionarLivro (titulo: string, autor: string, qntd_paginas: string, imagem: File) {

		/*const livro: Livro = {
			id: null,
			titulo: titulo,
			autor: autor,
			qntd_paginas: qntd_paginas
		};*/
	       const dadosLivro = new FormData ();
	       dadosLivro.append ("titulo", titulo);
	       dadosLivro.append ("autor", autor);
	       dadosLivro.append ("qntd_paginas", qntd_paginas);
	       dadosLivro.append ("imagem", imagem);

		this.httpClient.post<{mensagem: string, livro: Livro}> ('http://192.168.0.74:3000/api/livros',dadosLivro).subscribe((dados) => {
				//console.log (dados.mensagem);
				//livro.id = dados.id;
				const livro: Livro = {
					id: dados.livro.id,
					titulo: titulo,
					autor: autor,
					qntd_paginas: qntd_paginas,
					imagemURL: dados.livro.imagemURL
				}
				this.livros.push (livro);
				this.listaLivrosAtualizada.next ([...this.livros]);
				this.router.navigate (['/livros']);
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

	getLivro (idLivro: string) {
		return this.httpClient.get<{_id: string, titulo: string, autor: string, qntd_paginas: string}>('http://192.168.0.74:3000/api/livros/' + idLivro);
	}

	atualizarLivro (id: string, titulo: string, autor: string, qntd_paginas: string) {
		const livro: Livro = { id, titulo, autor, qntd_paginas, imagemURL: null};
		this.httpClient.put ('http://192.168.0.74:3000/api/livros/' + id, livro).subscribe ((res => {
			const copia = [...this.livros];
			const indice = copia.findIndex (liv => liv.id === livro.id);
			copia[indice] = livro;
			this.livros = copia;
			this.listaLivrosAtualizada.next ([...this.livros]);
			this.router.navigate (['/livros']);
		}));
	}
}
