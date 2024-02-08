import { Router } from "express";
// import passport from 'passport';
import { failLogin, failRegister, forgetPassword, login, logout, register, resetPassword } from "../controllers/sessions.controller.js";


const router = Router()
//Login
router.post('/login', login);

router.get('/logout',logout);

router.get('/fail-login', failLogin); 

// // //git
// router.get('/github', passport.authenticate('github', {scope:['user:email']}), githubAuth);

// router.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), githubLogin);

// //REGISTER

router.post('/register', register);

router.post('/forget-password', forgetPassword);

router.put('/reset-password', resetPassword);

router.get('/fail-register', failRegister); 



export default router;

