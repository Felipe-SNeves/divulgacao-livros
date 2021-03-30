const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');

app.use (bodyParser.json());

const livros = [
	{
		id: '1',
		titulo: 'Memórias Póstumas de Brás Cubas',
		autor: 'Machado de Assis',
		qntd_paginas: '243'
	},
	{
		id: '2',
		titulo: 'O Cortiço',
		autor: 'Aluísio Azevedo',
		qntd_paginas: '239'
	},
	{
		id: '3',
		titulo: 'Mayombe',
		autor: 'Pepetela',
		qntd_paginas: '248'
	}
];

app.use (

	(req, res, next) => {
		res.setHeader ('Access-Control-Allow-Origin', "*");
		res.setHeader ('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
		res.setHeader ('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
		next ();
	}
);

app.post ('/api/livros',

	(req, res, next) => {
		const livro = req.body;
		res.status(200).json({mensagem: 'O livro foi inserido com sucesso!'});
	}
);

app.use ('/api/livros',

	(req, res, next) => {

		res.status(200).json({mensagem: "Submetendo lista de livros!", livros: livros});
	}
);

module.exports = app;
