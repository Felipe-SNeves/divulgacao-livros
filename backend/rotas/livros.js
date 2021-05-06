const express = require ('express');
const router = express.Router ();
const Livro = require ('../models/livro');

router.post ('',

        (req, res, next) => {

                const livro = new Livro ({
                        id: req.body.id,
                        titulo: req.body.titulo,
                        autor: req.body.autor,
                        qntd_paginas: req.body.qntd_paginas
                });
                livro.save ().then (livroInserido => {
                        res.status(200).json({
                                mensagem: 'Cliente inserido',
                                id: livroInserido._id
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
