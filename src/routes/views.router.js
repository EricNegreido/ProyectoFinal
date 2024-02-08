// Rutas que se renderizan !!!!
import { Router } from "express";
import Products from '../dao/dbManagers/products.manager.js'
import Carts from '../dao/dbManagers/carts.manager.js'
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/auth.js";

const productsManager = new Products(); // CORREGIR

const cartsManager = new Carts();// CORREGIR

const router = Router();



router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/reset-password', (req, res) => {
    const token = req.query.token
    res.render('reset-password', {token});
});

router.get('/products', passportCall('jwt'), async (req, res) =>{
    
    if(req.user.rol === 'Admin' || req.user.rol === 'Premium') return res.redirect('/admin/products');
    const {page = 1 , limit = 5, sort, query} = req.query;

    try{

        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsManager.getAll(limit, page, sort, query);
        res.render('products', {
            product : docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            user: req.user


        })
    }catch(error){
        console.log(error.message);
        res.status(500).send('ERROR AL CARGAR VIEWS')
    }
});

router.get('/admin/products', passportCall('jwt'), authorization('Premium'), async (req, res) =>{
    const {page = 1 , limit = 5, sort, query} = req.query;

    try{
        const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsManager.getAll(limit, page, sort, query);
       

        res.render('adminproducts', {
            product : docs,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage,
            user: req.user


        })
    }catch(error){
        console.log(error.message);
        res.status(500).send('ERROR AL CARGAR VIEWS')
    }
});

router.get('/carts', passportCall('jwt'), async (req, res) => {
    const cid = req.user.cartsId;
    try {
        const carts = await cartsManager.getArray(cid);
        const products = carts.products.map(item => item.product); 

        res.render('carts', { products,  cid}); 
    } catch (error) {
        console.log(error.message);
    }
});
 
export default router;