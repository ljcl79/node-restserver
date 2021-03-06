const { response } = require('express');
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let filtro = {estado:true};

    desde = Number(desde);
    limite = Number(limite);


    Usuario.find(filtro,'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err: err
            });
        }

        Usuario.countDocuments(filtro, (err, conteo) => {
            res.json({
                ok: true,
                cuantos:conteo,
                usuarios
            });
        })

        

    });
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err,usuarioDB)=> {
        if (err) {
            return res.status(400).json({
                ok:false,
                err: err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
  
});

app.put('/usuario/:id',function (req, res){
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role','estado']);
    
    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true, context:'query'}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
    
});

app.delete('/usuario/:id', function(req,res) {
    let id = req.params.id;
    let cambiaEstado = {estado:false};

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true, context:'query'}, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

    /*
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok:false,
                err: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'El usuario no existe',
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */
});

module.exports = app;