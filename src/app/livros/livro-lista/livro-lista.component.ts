import { Component, OnInit, OnDestroy } from '@angular/core';
import { Livro } from '../livro.model';
import { LivroService } from '../livro.service';
import { Subscription } from 'rxjs';

@Component({
  	selector: 'app-livro-lista',
  	templateUrl: './livro-lista.component.html',
  	styleUrls: ['./livro-lista.component.css']
})

export class LivroListaComponent implements OnInit, OnDestroy {

	livros: Livro[] = [];
	private livrosSubscription: Subscription;
	public loading: boolean = false;

  	constructor(private livroService: LivroService) { }

  	ngOnInit (): void {
		this.loading = true;
		this.livroService.getLivros ();
		this.livrosSubscription = this.livroService.getListaLivrosAtualizadaObservable().subscribe ( (livros: Livro []) => { 
			this.loading = false;
			this.livros = livros; } );
  	}

	ngOnDestroy (): void {
		this.livrosSubscription.unsubscribe ();
	}

	onDelete (id: string): void {
		console.log ('Excluindo o livro de id: ' + id);
		this.livroService.removerLivro(id);
	}
}
