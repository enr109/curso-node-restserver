const { Router } = require('express');
const { check } = require('express-validator');
const { 
    crearCategoria, 
    obtenerCategoria,
    obtenerCategorias,
    actualizarCategoria,
    borrarcategoria
 } = require('../controller/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validarJWT, validarCampos,esAdminRole } = require('../middlewares');


const router = Router();


/* {{url}}/api/categorias */


// Obtener todas las categorias- publico
router.get('/', obtenerCategorias);

// Obtener una  categorias por id- publico
router.get('/:id',[
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

// Crear categorias- privada - cualquier persona con un token valido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);


// Actualizar - privado - cualquier con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],actualizarCategoria)

// Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],borrarcategoria)

module.exports = router;