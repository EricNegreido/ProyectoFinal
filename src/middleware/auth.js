export const authorization = (role) =>{
    return async (req, res, next) =>{
        if(!req.user) return res.status(401).send(({error:"Unauthorized"}));
        if(req.user.rol !== 'Admin'){
            if(req.user.rol != role) return res.status(403).send(({error:"No permissions"}));
        }
        next();
    }
}
