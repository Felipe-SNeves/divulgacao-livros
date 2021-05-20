import { Component, OnInit, OnDestroy } from '@angular/core';
import { Livro } from '../livro.model';
import { LivroService } from '../livro.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  	selector: 'app-livro-lista',
  	templateUrl: './livro-lista.component.html',
  	styleUrls: ['./livro-lista.component.css']
})

export class LivroListaComponent implements OnInit, OnDestroy {

	livros: Livro[] = [];
	private livrosSubscription: Subscription;
	public loading: boolean = false;
	totalDeLivros: number = 10;
	totalDeLivrosPorPagina: number = 2;
	opcoesTotalDeLivrosPorPagina = [2, 5, 10];
	paginaAtual: number = 0;

  	constructor(private livroService: LivroService) { }

  	ngOnInit (): void {
		this.loading = true;
		this.livroService.getLivros (this.totalDeLivrosPorPagina, this.paginaAtual);
		this.livrosSubscription = this.livroService.getListaLivrosAtualizadaObservable().subscribe ( (dados: {livros: Livro [], maxLivros: number}) => { 
			this.loading = false;
			this.livros = dados.livros;
		        this.totalDeLivros = dados.maxLivros;	
		});
  	}

	ngOnDestroy (): void {
		this.livrosSubscription.unsubscribe ();
	}

	onDelete (id: string): void {
		this.loading = true;
		this.livroService.removerLivro(id).subscribe( () => {
			this.livroService.getLivros(this.totalDeLivrosPorPagina, this.paginaAtual);
		});
	}

	onPaginaAlterada (dadosPagina: PageEvent) {
		this.loading = true;
		this.paginaAtual = dadosPagina.pageIndex + 1;
		this.totalDeLivrosPorPagina = dadosPagina.pageSize;
		this.livroService.getLivros (this.totalDeLivrosPorPagina, this.paginaAtual);
	}
}
