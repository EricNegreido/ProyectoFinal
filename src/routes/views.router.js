import { Router } from "express";
import Products from "../dao/dbManagers/products.manager.js";
const productsManager = new Products();

const router = Router();


router.get('/products', async(req, res) =>{
    try{
        const products = await productsManager.getAll();
        
        res.render('products', {products});
    }catch(error){
        res.status(500).send({status: 'error', error: error.message})
    }
    
});
router.get('/chat', (req, res) =>{
    res.render('chat', {});
})


export default router;