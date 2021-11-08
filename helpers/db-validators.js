const { Categorias,Role,Usuario,Producto } = require('../models');


const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no esta resgistrado en la BD`)
    }
}

const emailExiste = async( correo = '' ) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    
    if ( existeEmail ) {
        throw new Error(`Este correo: ${ correo } ya esta registrado`);
    }
}


const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    
    if ( !existeUsuario ) {
        throw new Error(`Este Id no existe ${ id }`);
    }
}

const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categorias.findById(id);

    if ( !existeCategoria ) {
        throw new Error(`Este id no existe ${ id }`);
    }
}

const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById(id);

    if ( !existeProducto) {
        throw new Error(`Este id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}