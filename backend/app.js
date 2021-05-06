const express = require ('express');
const app = express ();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const livroRoutes = require ('./rotas/livros');

mongoose.connect ('mongodb://localhost:27017/app-livros', {useNewUrlParser: true})
.then( () => console.log ('MongoDB: OK')).catch( () => console.log('MongoDB: Failure'));

app.use (bodyParser.json());

app.use (

	(req, res, next) => {
		res.setHeader ('Access-Control-Allow-Origin', "*");
		res.setHeader ('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
		res.setHeader ('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS');
		next ();
	}
);

app.use ('/api/livros', livroRoutes);

module.exports = app;
