import { Component, OnInit } from '@angular/core';
import { Livro } from '../livro.model';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
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
	form: FormGroup;

	onSalvarLivro () {
		if (this.form.invalid) return;

		this.loading = true;

		if (this.modo === "criar") {

			this.livroService.adicionarLivro (
				this.form.value.titulo,
				this.form.value.autor,
				this.form.value.qntd_paginas
			);
		}
		else {
			this.livroService.atualizarLivro (
				this.idLivro,
				this.form.value.titulo,
				this.form.value.autor,
				this.form.value.qntd_paginas
			);
		}
		this.form.reset ();
	}

	constructor (private livroService: LivroService, public route: ActivatedRoute) {
	}

	ngOnInit (): void {
		this.form = new FormGroup ({
			titulo: new FormControl (null, {validators: [Validators.required, Validators.minLength (5)]}),
			autor: new FormControl (null, {validators: [Validators.required]}),
			qntd_paginas: new FormControl (null, {validators: [Validators.required]})
		});
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
					this.form.setValue ({
						titulo: this.livro.titulo,
						autor: this.livro.autor,
						qntd_paginas: this.livro.qntd_paginas
					});
				});
			}
			else {
				this.modo = "criar";
				this.idLivro = null;
			}
	});	
	}
}
