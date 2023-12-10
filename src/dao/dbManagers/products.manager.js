import {productsModel} from '../models/products.models.js';

export default class Products {
    constructor(){
        console.log("Working products with DB");
    }

    getAll = async () => {
        const products = await productsModel.find().lean(); // Con .lean() convertimos a un objetos manipulable en java
        return products;

    }
    getById = async (id) => {
        const product = await productsModel.findById({_id: id}).lean(); // Con .lean() convertimos a un objetos manipulable en java
        return product;

    }
    save = async (product) => {
        const result = await productsModel.create(product);
        return result;
    }

    update = async (id, product) => {
        const result = await productsModel.updateOne({_id: id}, product);
        return result
    }
}



