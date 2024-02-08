import express from 'express'
import {__dirname,  addLogger } from './utils.js';
import handlebars from 'express-handlebars'
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import cartsRouter from './routes/carts.router.js';
import productsRouter from './routes/products.router.js';
import ticketRouter from './routes/ticket.router.js';
import mockRouter from './routes/mock.router.js';
import logtestRouter from './routes/logtest.router.js';
import usersRouter from './routes/users.router.js';
import intializePassport from './config/passport.config.js';
import passport from 'passport';
import errorHanlder from './middleware/errors/index.js';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import { fatalLogger } from './utils.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
import {__mainDirname} from './utils.js'
import handleConnection from './chatApp/chat.js';
const app = express();

const PORT =  process.env || 8080;

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info:{
            title: 'Documentacion Ecommerce',
            description: 'Venta de productos'
        }
    },
    apis:[`${__mainDirname}/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs/', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

intializePassport();
app.use(passport.initialize());

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');



app.use(addLogger);
app.use(errorHanlder);

app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/mockingproducts', mockRouter);
app.use('/api/loggerTest', logtestRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);



app.use(fatalLogger);

const httpServer  = app.listen(PORT, () => console.log('server running'));

const io = new Server(httpServer);
 
io.on('connection', socket => handleConnection(socket,io));



