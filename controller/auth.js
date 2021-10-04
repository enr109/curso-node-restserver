const { response, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { validarCampos } = require('../middlewares/validar-campos');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req,res = response) => {


    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Si el usuario esta activo

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password);
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id);

        

        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Habla con el administrador'
        });
        
    }
}

const googleSignIn = async( req, res = response ) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ){
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }


        // si el usuario en DB

        if( !usuario.estado ){
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'El nombre no se puedo verificar'
        })
    }

}

module.exports = {
    login,
    googleSignIn
}