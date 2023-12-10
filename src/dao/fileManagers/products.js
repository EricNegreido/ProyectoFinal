import express from 'express'
import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const productRouter = express.Router();
let productId = 0;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

productRouter.get("/", async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'products.json'), 'utf-8');
        const products = JSON.parse(data);

        const limit = req.query.limit || products.length;
        res.json(products.slice(0, limit));
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'NO SE PUDO OBTENER LOS PRODUCTOS' });
    }
});

productRouter.get("/:pid", async (req, res) => {
    try{
    const pid= req.params.pid;
    const data = await fs.readFile(path.join(__dirname,'products.json'), 'utf-8');
    const products = JSON.parse(data);
    
    const product = products.find(elem => elem.id == pid);
    if(product){
        res.json(product);
    }
    else{
        
        res.status(404).json({error:'PRODUCTO NO ECONTRADO'});
        
    }
    }catch(error){
        res.status(500).json({error:'NO SE PUDO OBTENER LOS PRODUCTOS'});
    }
});
productRouter.post("/", async(req, res) => {
    try{
        const {title, desc, code, price, stock, category} = req.body;
        if(!title || !desc || !code || !price || !stock || !category){
            return res.status(400).json({error: 'TODOS LOS CAMPOS SON OBLIGATORIOS'});
        }
        
        const pid = productId + 1;
        productId++;

        const newProduct = {
            id : pid,
            title,
            desc,
            code,
            price,
            status : true,
            stock,
            category,
        }
        // const data = await fs.readFile(path.join(__dirname,'products.json'), 'utf-8');
        // const products = JSON.parse(data);
        let products;
        try {
            const data = await fs.readFile(path.join(__dirname, 'products.json'), 'utf-8');
            products = JSON.parse(data);
        } catch (error) {
            const initialData = '[]';
            await fs.writeFile(path.join(__dirname, 'products.json'), initialData, 'utf-8');
            products= JSON.parse(initialData);
        }

            products.push(newProduct);
        

        await fs.writeFile(path.join(__dirname, 'products.json'), JSON.stringify(products, null, 2), 'utf-8');
        res.status(201).json({ message: 'PRODUCTO AGREGADO', product: newProduct});

    }catch(error){
        console.error(error)
        res.status(500).json({error:'ERROR AL AGREGAR PRODUCTO'})

    }

    
})

productRouter.put('/:pid', async(req, res) => {
    try{
        const {title, desc, code, price, status, stock, category} = req.body;

        const data = await fs.readFile( path.join(__dirname,'products.json'), 'utf-8');
        const products = JSON.parse(data); 

        const index = products.findIndex((elem) => elem.id === req.params.pid);

        if(index === -1){
            return res.status(404).json({error: 'PRODUCTO NO ECONTRADO'});
        }

        const updateProduct = {
            ...products[index],
            title,
            desc,
            code,
            price,
            status: status === 'true',
            stock,
            category
        }

        products[index] = updateProduct;

        await fs.writeFile(path.join(__dirname,'products.json'), JSON.stringify(products, null, 2), 'utf-8');

        res.json({ message: 'PRODUCTO ACTUALIZADO', product: updateProduct});

 

    }catch(error){
        res.status(500).json({error: 'ERROR AL ACTUALIZAR'});
    }

})

productRouter.delete('/:pid', async(req, res) => {
    try { 
        const data = await fs.readFile( path.join(__dirname,'products.json'), 'utf-8');
        const products = JSON.parse(data); 

        const index = products.findIndex((elem) => elem.id === req.params.pid);

        if(index === -1){
            return res.status(404).json({error: 'PRODUCTO NO ECONTRADO'});
        }

        const deletedProduct = products.splice(index, 1)[0];
        await fs.writeFile(path.join(__dirname,'products.json'), JSON.stringify(products, null, 2));

        res.json({ message: 'PRODUCTO ELIMINADO', product: deletedProduct});

    } catch (error) {
        res.status(500).json({error: 'ERROR AL ELIMINAR PRODUCTO'});

    }
});
export default productRouter;
