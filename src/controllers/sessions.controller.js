import { UserDto } from "../DTOs/dto.js";
import usersModel from "../dao/dbManagers/models/users.models.js";
import { addCartService } from "../services/carts.services.js";
import { createHash, generateResetToken, generateToken, isValidPassword, sendResetEmail } from "../utils.js";
import jwt from "jsonwebtoken";


const FORGET_KEY = process.env.FORGET_KEY;
const USER_ADMIN = process.env.USER_ADMIN;

//LOGIN
const authLogin =  async (req, res) => {
    
    if(!req.user)
        return res.status(401).send({status: 'error', message: 'incorrect credentials'});

    const user = new UserDto(req.user);
    req.user = user;
    
    req.logger.info("successfully auth user");
    res.send({status: 'success', message: 'login success'});
};

const failLogin = async (req, res) => {
    req.logger.error("error authenticating user");
    res.status(500).send({status: 'error', message:'login fail'})
 };


const logout = (req, res) =>{

        res.clearCookie('CookieToken');
        res.redirect('/login');
};
//REGISTER
const register = async (req, res) => {
    try {
        const {first_name, last_name, age, email, password} = req.body;

        const userEmail = await usersModel.findOne({email});
        
        if(userEmail) {
        res.status(400).send({status: 'error', message:'user already exist'}) 
        }
        const rol = (email === USER_ADMIN) ? 'Admin' : 'User'; // NO ME DEJA COMPARAR CON PASSWORD POR ESO SOLO COLOQUE EL MAIL


        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            rol
        };

        await usersModel.create(newUser);

        const accesToken = generateToken(newUser);

        res.send({status: 'success', access_token: accesToken}) 
        
    } catch (error) {
        console.error(error);
        res.status(500).send({status: 'error', message:'register fail'}) 
    }
};

const login = async(req, res) =>{

    try {
    const {email, password} = req.body;
    const userEmail = await usersModel.findOne({email});
    const user = userEmail && isValidPassword(password, userEmail.password);
    if(!user) return res.status(400).send({status: 'error', message: 'invalid credentials'}); //CORREGIR ESTA WEAA
    const accesToken = generateToken(userEmail); 
    if(!userEmail.cartsId){
       const newCart = await addCartService()
       userEmail.cartsId = newCart._id;
       await usersModel.updateOne({ _id: userEmail._id }, { $set: { cartsId: newCart._id } });
    }
    res.cookie('CookieToken', accesToken, 
    {httpOnly:true,
    maxAge: 60 * 60 * 1000
    }).send({status: 'success'}) 

    }catch(error){
        console.error(error);
        res.status(500).send({status: 'error', message:'login fail'}) 
    }

}
const failRegister =  async (req, res) => {
    req.logger.error("error registering user");

    res.status(500).send({status: 'error', message:'register fail'})
 };


 const forgetPassword = async (req, res) => {


    const { resetEmail : userEmail } = req.body;

    try {
        const user = await usersModel.findOne({email: userEmail});
        if (!user) {
            return res.status(404).json({ error: 'Correo electrónico no encontrado.' });
        }

        const resetToken = generateResetToken(user._id);
        sendResetEmail(userEmail, resetToken);

        res.status(200).json({ message: 'Correo electrónico de restablecimiento enviado con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud.' });
    }
 }

 const resetPassword = async (req, res) => {

    const { token, newPassword } = req.body;

    try {
        const decodedToken = jwt.verify(token, FORGET_KEY);

        if (decodedToken.exp < Date.now() / 1000) {
            return res.status(400).json({ error: 'El enlace de restablecimiento ha expirado.' });
        }

        const user = await usersModel.findById(decodedToken.userId);

        const passwordMatch = isValidPassword(newPassword, user.password);
        if (passwordMatch) {
            return res.status(400).json({ error: 'No puedes restablecer la contraseña con la misma contraseña.' });
        }

        const { userId } = decodedToken;
        const hashedPassword = createHash(newPassword);
        await usersModel.updateOne({ _id: userId }, { $set: { password: hashedPassword } });
        
        res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al restablecer la contraseña.' });
    }
};

export{
    authLogin,
    logout,
    failLogin,
    register,
    failRegister,
    login,
    forgetPassword,
    resetPassword
}

