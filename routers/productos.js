const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarproducto
} = require('../controller/productos');
const { validarJWT, validarCampos,esAdminRole } = require('../middlewares');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();




// OBtener los productos
router.get('/', obtenerProductos);

router.get('/:id', obtenerProducto );

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatoria').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos
], crearProducto);

router.put('/:id',[
    validarJWT,
    check('categoria','No es un id de Mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);


router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
],borrarproducto);



module.exports = router;