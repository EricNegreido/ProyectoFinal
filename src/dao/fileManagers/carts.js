import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { fileURLToPath } from 'url';


const cartsRouter= express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cartsRouter.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        const cartId = uuidv4();
        
        const newCart = {
            id: cartId,
            products: products
        };
        
        let data;
        let carts;
        
        try {
            data = await fs.readFile(path.join(__dirname, 'carts.json'), 'utf-8');
            carts = JSON.parse(data);
        } catch (error) {
            const initialData = '[]';
            await fs.writeFile(path.join(__dirname, 'carts.json'), initialData, 'utf-8');
            carts = JSON.parse(initialData);
        }
        
        carts.push(newCart);
        
        await fs.writeFile(path.join(__dirname, 'carts.json'), JSON.stringify(carts, null, 2), 'utf-8');
        
        res.status(201).json(newCart);
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'ERROR AL CREAR CARRITO' });
    }
});


cartsRouter.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;

        const data = await fs.readFile(path.join(__dirname, 'carts.json'), 'utf-8');
        const carts = JSON.parse(data);

        let cart = carts.find((elem) => elem.id === cid);
        if(cart){

            const product = cart.products.find((elem) => elem.id === pid);

            if (product) {
                product.quantity += quantity || 1;
            } else {
                cart.products.push({ id: pid, quantity: quantity || 1 });
            }
     }

        await fs.writeFile(path.join(__dirname, 'carts.json'), JSON.stringify(carts, null, 2), 'utf-8');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'ERROR AL AGREGAR EL PRODUCTO' });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;

        const data = await fs.readFile(path.join(__dirname, 'carts.json'), 'utf-8');
        const carts = JSON.parse(data);

        const cart = carts.find((elem) => elem.id === cid);

        if (!cart) {
            return res.status(404).json({ error: 'CART NOT FOUND' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'ERROR FETCHING CART' });
    }
});


export default cartsRouter;
