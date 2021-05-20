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

	private listaLivrosAtualizada = new Subject <{ livros: Livro [], maxLivros: number }> ();
	private livros: Livro [] = [];

	constructor (private httpClient: HttpClient, private router: Router) {
	}

	getLivros (pageSize: number, page: number) {
		const url = 'http://192.168.0.74:3000/api/livros?pageSize='+pageSize+'&page='+page;
	this.httpClient.get <{mensagem: string, livros: any, maxLivros: number}> (url).pipe(map((dados) => {
	return 	{
		livros: dados.livros.map ((livro) => {
			return {
				id: livro._id,
				titulo: livro.titulo,
				autor: livro.autor,
				qntd_paginas: livro.qntd_paginas,
				imagemURL: livro.imagemURL
			}
		}),
		maxLivros: dados.maxLivros
	}
	})).subscribe (

			(dados) => {
				this.livros = dados.livros;
				this.listaLivrosAtualizada.next ({livros: [...this.livros], maxLivros: dados.maxLivros});
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
				this.router.navigate (['/livros']);
			}					 
		)

	}

	getListaLivrosAtualizadaObservable () {
		return this.listaLivrosAtualizada.asObservable ();
	}

	removerLivro (id: string) {
		return this.httpClient.delete('http://192.168.0.74:3000/api/livros/' + id);
	}

	getLivro (idLivro: string) {
		return this.httpClient.get<{_id: string, titulo: string, autor: string, qntd_paginas: string, imagemURL: string}>('http://192.168.0.74:3000/api/livros/' + idLivro);
	}

	atualizarLivro (id: string, titulo: string, autor: string, qntd_paginas: string, imagem: File | string) {
		//const livro: Livro = { id, titulo, autor, qntd_paginas, imagemURL: null};
		let livroData: Livro | FormData;

		if(typeof(imagem)==='object') {
			livroData = new FormData ();
			livroData.append ('id', id);
			livroData.append ('titulo', titulo);
			livroData.append ('autor', autor);
			livroData.append ('qntd_paginas', qntd_paginas);
			livroData.append ('imagem', imagem, titulo);
		}
		else{
			livroData = {
				id: id,
				titulo: titulo,
				autor: autor,
				qntd_paginas: qntd_paginas,
				imagemURL: imagem
			};
		}
		this.httpClient.put ('http://192.168.0.74:3000/api/livros/' + id, livroData).subscribe ((res => {
			this.router.navigate (['/livros']);
		}));
	}
}
