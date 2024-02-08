import usersModel from "../dao/dbManagers/models/users.models.js";

const userPremium = async(req, res) =>{
    try {
        const {newStatus} = req.body;
        const {uid} = req.params;

        await usersModel.updateOne({ _id: uid }, { $set: { rol: newStatus } });
    
        res.status(200).json({ message: 'Rol cambiado con exito' });
    } catch (error) {
        
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar de rol' });
    }
    
}
const changeRol = async(req, res) =>{
    try {
        const userId =  req.user._id;
        const userRol = req.user.rol;
        const isUser = userRol === "User"
        res.render('userPremium', {userId, userRol, isUser});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro al renderizar views' });
    }
    
}
export {changeRol, userPremium}