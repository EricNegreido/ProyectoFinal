import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user:'ericnegreidooo@gmail.com',
        pass:'ozopmzysnlddgcbn'
    }

});

const sendEmail = async ({ content, email }) =>{
    // const {content, email} = req.body;
    try {

        await transporter.sendMail({
            from: 'AppCoder',
            to: email,
            subject: 'TICKET DE COMPRA',
            html: content
        });

    } catch (error) {
        console.log(error)
    }
    

}

export default sendEmail