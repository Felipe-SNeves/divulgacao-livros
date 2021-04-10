const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const Livro = require ('./models/livro');

mongoose.connect ('mongodb://localhost:27017/app-livros', {useNewUrlParser: true})
.then( () => console.log ('MongoDB: OK')).catch( () => console.log('MongoDB: Failure'));

app.use (bodyParser.json());

const livros = [];

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

		const livro = new Livro ({
			id: req.body.id,
			titulo: req.body.titulo,
			autor: req.body.autor,
			qntd_paginas: req.body.qntd_paginas
		});
		livro.save ();
		res.status(200).json({mensagem: 'O livro foi inserido com sucesso!'});
	}
);

app.get ('/api/livros',

	(req, res, next) => {

		Livro.find().then ( documents => {
		res.status(200).json({
			mensagem: "Submetendo lista de livros!",
			livros: documents
		});
	})
});

module.exports = app;
