import { Router } from "express";
import Carts from '../dao/dbManagers/carts.manager.js';
import Products from '../dao/dbManagers/products.manager.js';


const router = Router();
const cartsManager = new Carts();
const productsManager = new Products();


router.get('/:cid', async (req, res) =>{

    const {cid} = req.params;
    try{
        const carts = await cartsManager.getArray(cid);
        res.send({status: 'sucess', payload: carts});
    }catch(error){
        res.status(500).send({status: 'error', error: error.message})
    }

});

router.post('/', async (req, res) =>{
    
    try{
        const result = await cartsManager.save();
        res.status(201).send({status: 'sucess', payload: result}); 

    }catch(error){
        res.status(500).send({status: 'error', error: error.message})
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const cart = await cartsManager.getArray(cid)
        const product = await productsManager.getById(pid);

        if(cart){


            if (product) {
                const existingProduct = cart.products.find(item => item.id === pid);
                if (existingProduct) {

                    existingProduct.quantity += quantity || 1;
                } else {

                    cart.products.push({ id: pid, quantity: quantity || 1 });
                }
        }

     }


    const result = await cartsManager.update(cid, { products: cart.products });
    console.log(result)
    res.status(201).send({status: 'sucess', payload: result}); 


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'ERROR AL AGREGAR EL PRODUCTO' });
    }
});

export default router;