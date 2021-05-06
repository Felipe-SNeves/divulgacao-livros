import { Component, OnInit } from '@angular/core';
import { Livro } from '../livro.model';
import { NgForm } from '@angular/forms';
import { LivroService } from '../livro.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  	selector: 'app-livro-inserir',
  	templateUrl: './livro-inserir.component.html',
  	styleUrls: ['./livro-inserir.component.css']
})

export class LivroInserirComponent implements OnInit {

	private modo: string = "criar";
	private idLivro: string;
	public livro: Livro;
	public loading: boolean = false;

	onSalvarLivro (livroForm: NgForm) {
		if (livroForm.invalid) return;

		this.loading = true;

		if (this.modo === "criar") {

			this.livroService.adicionarLivro (
				livroForm.value.titulo,
				livroForm.value.autor,
				livroForm.value.qntd_paginas
			);
		}
		else {
			this.livroService.atualizarLivro (
				this.idLivro,
				livroForm.value.titulo,
				livroForm.value.autor,
				livroForm.value.qntd_paginas
			);
		}
		livroForm.resetForm ();
	}

	constructor (private livroService: LivroService, public route: ActivatedRoute) {
	}

	ngOnInit (): void {
		this.route.paramMap.subscribe ((paramMap: ParamMap) => { 
			if (paramMap.has ('idLivro')) {
				this.modo = "editar";
				this.idLivro = paramMap.get ('idLivro');
				this.loading = true;
				this.livroService.getLivro (this.idLivro).subscribe( dadosLiv => {
					this.loading = false;
					this.livro = {
						id: dadosLiv._id,
						titulo: dadosLiv.titulo,
						autor: dadosLiv.autor,
						qntd_paginas: dadosLiv.qntd_paginas
					};
				});
			}
			else {
				this.modo = "criar";
				this.idLivro = null;
			}
	});	
	}
}
