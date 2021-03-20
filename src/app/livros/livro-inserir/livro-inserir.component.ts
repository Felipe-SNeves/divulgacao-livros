import { Component } from '@angular/core';
import { Livro } from '../livro.model';
import { NgForm } from '@angular/forms';
import { LivroService } from '../livro.service';

@Component({
  	selector: 'app-livro-inserir',
  	templateUrl: './livro-inserir.component.html',
  	styleUrls: ['./livro-inserir.component.css']
})

export class LivroInserirComponent {

	onAdicionarLivro (livroForm: NgForm) {
		if (livroForm.invalid) return;
		this.livroService.adicionarLivro (
			livroForm.value.id,
			livroForm.value.titulo,
			livroForm.value.autor,
			livroForm.value.qntd_paginas
		);
		livroForm.resetForm ();
	}

	constructor (private livroService: LivroService) {
	}
}
