const mongoose = require ('mongoose');
const livroSchema = mongoose.Schema ({

	id: {type: String, required: false},
	titulo: {type: String, required: true},
	autor: {type: String, required: true},
	qntd_paginas: {type: String, required: false, default: 'Desconhecido'}
});

module.exports = mongoose.model ('Livro', livroSchema);
