const { response } = require('express');
const { Producto } = require('../models');


const obtenerProductos = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [ total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario','nombre')
        .populate('categoria','nombre')
        .skip(Number(desde))
        .limit( Number(limite))
    ]);
    res.json({
        total,
        productos
    })
}

const obtenerProducto = async(req,res= response) => {
    
    const { id } = req.params;
    const productos = await Producto.findById( id )
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.json({
        productos
    })
}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El Producto ${ productoDB.nombre }, ya existe`
        });
    }

    //Genera la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    await producto.save();

    res.status(201).json(producto);
}

// actualizarCategoria 

const actualizarProducto = async(req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data} = req.body;
    /* const { nombre } = req.body; */
    
    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const productoDB = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Producto actualizada',
        productoDB
    });
}

// borrarcategoria - estado: false

const borrarproducto = async(req, res = response) => {
    const { id } = req.params;

    const productoBorrada = await Producto.findByIdAndUpdate(id, { estado: false});
    

    res.json({ productoBorrada});
}


module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarproducto
}