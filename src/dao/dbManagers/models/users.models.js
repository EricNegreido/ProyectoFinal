import mongoose from 'mongoose'

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    age: Number,
    password: String,
    rol: String,
    last_connection: String,
    cartsId: String


});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;

