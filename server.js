const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./config/passport');

const MONGO_URL = 'mongodb://127.0.0.1:27017/auth';
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, { useNewUrlParser: true, 'useCreateIndex': true });
mongoose.connection.on('error', (err) => {
    throw err;
    process.exit(1);
})

// const Usuario = require('./modelos/Usuario');
// const u = new Usuario({
//     email: 'a@a.com',
//     nombre: 'Alex',
//     password: '123456'
// });


// u.save()
//     .then(() => {
//         console.log('Guardado');
//     })
//     .catch((error) => {
//         console.log(error);
//     })

app.use(session({
    secret: 'ESTO ES SECRETO',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        url: MONGO_URL,
        autoReconnect: true
    })
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     req.session.cuenta = req.session.cuenta ? req.session.cuenta + 1 : 1;
//     res.send('Hola!, Has visto esta página ' + req.session.cuenta + ' veces.');
// })

const controladorUsuario = require('./controladores/usuario');

app.post('/signup', controladorUsuario.postSignup);
app.post('/login', controladorUsuario.postLogin);
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout);

app.get('/usuarioInfo', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
});

app.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
})