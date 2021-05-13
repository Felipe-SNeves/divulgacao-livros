const express = require ('express');
const router = express.Router ();
const Livro = require ('../models/livro');
const multer = require ('multer');

const MIME_TYPE_EXTENSAO_MAPA = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/bmp': 'bmp'
}

const armazenamento = multer.diskStorage ({
	destination: (req, file, callback) => {
		let e = MIME_TYPE_EXTENSAO_MAPA[file.mimetype] ? null : new Error ('Mime Type Invalid');
		callback (e, "backend/imagens");
	},
	filename: (req, file, callback) => {
		const nome = file.originalname.toLowerCase().split(" ").join("-");
		const extensao = MIME_TYPE_EXTENSAO_MAPA[file.mimetype];
		callback (null, nome+Date.now()+'.'+extensao);
	}
});

router.post ('', multer({storage: armazenamento}).single('imagem'),

        (req, res, next) => {
		const imagemURL = req.protocol+'://'+req.get('host');
                const livro = new Livro ({
                        id: req.body.id,
                        titulo: req.body.titulo,
                        autor: req.body.autor,
                        qntd_paginas: req.body.qntd_paginas,
			imagemURL: imagemURL+'/imagens/'+req.file.filename
                });
                livro.save ().then (livroInserido => {
                        res.status(200).json({
                                mensagem: 'Cliente inserido',
                                //id: livroInserido._id
				livro: {
					id: livroInserido._id,
					titulo: livroInserido.titulo,
					autor: livroInserido.autor,
					qntd_paginas: livroInserido.qntd_paginas,
					imagemURL: livroInserido.imagemURL
				}
                        })
                });
        }
);

router.get ('',

        (req, res, next) => {

                Livro.find().then ( documents => {
                console.log (documents);
                res.status(200).json({
                        mensagem: "Submetendo lista de livros!",
                        livros: documents
                });
        })
});

router.delete ('/:id', 
        (req, res, next) => {
                Livro.deleteOne ({_id: req.params.id}).then ((resultado) => {
                        console.log (resultado);
                        res.status(200).json({mensagem: "Livro removido"});
                })
        }
)

router.put ('/:id', 

        (req, res, next) => {
                const livro = new Livro ({
                        _id: req.params.id,
                        titulo: req.body.titulo,
                        autor: req.body.autor,
                        qntd_paginas: req.body.qntd_paginas
                });

                Livro.updateOne ({_id: req.params.id}, livro).then ((resultado) => {
                        console.log (resultado);
                });
                res.status (200).json ({mensagem: 'Atualização realizada com sucesso'});
});

router.get ('/:id', (req, res, next) => {
        Livro.findById (req.params.id).then (liv => {
                if (liv)
                        res.status (200).json (liv);
                else
                        res.status (404).json ({mensagem: "Livro não encontrado!"});
        })
});

module.exports = router;
