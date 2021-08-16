const express = require('express');
const app = express();

// dotenv 파일 연결 
const dotenv = require('dotenv');
dotenv.config({path: './.env'})
//bodyparser
const bodyParser = require('body-parser');
//override 연결 
const methodoverRide = require('method-override')
//Routes 연결
const routes = require('./src/routes/routes');
const auth = require('./src/routes/auth')
const plan = require('./src/routes/plan')

//passport 연결
const passport = require('passport');
require('./config/passport')(passport)


//mongodb
const mongoose = require('mongoose')

//path 연결
const path = require('path')

//sesstion 연결
const session = require('express-session');
//mongo 저장소 
const MongoStore = require('connect-mongo')

//public 정적폴더 연결
app.use(express.static(path.join(__dirname , 'src/public')))
//morgan 연결
const morgan = require('morgan');

//bodyParser 미들웨어
app.use(bodyParser.urlencoded({extended: false}))

//method-overRide 미들웨어
app.use(methodoverRide(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method
      delete req.body._method
      return method
    }
}))
//json 데이터
app.use(express.json())
//connectDB 가져오기
const connectDB = require('./config/db')
connectDB();
//session 미들웨어
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL
    })
}))
//Passport 미들웨어 
app.use(passport.initialize());
app.use(passport.session());



//moment 연결
const {formatDate , truncate , stripTags , editIcon , select} = require('./src/heplers/hbs')
//templtet 셋팅 
const exphbs = require('express-handlebars');
const { Session } = require('inspector');
app.engine('.hbs', exphbs({ helpers: {formatDate , truncate , stripTags , editIcon , select } ,defaultLayout: 'main' , extname: '.hbs'}));
app.set('views' , 'src/views')
app.set('view engine', '.hbs');

//set glover 변수
app.use(function(req ,res , next){
    res.locals.user = req.user || null;
    next()
})




//route 미들웨어 등록
app.use('/' , routes)
app.use('/auth' , auth)
app.use('/plan' , plan)

//env 개발환경 설정 개발로그 환경 구축
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    console.log('Production Mode')
}else if(process.env.NODE_ENV === "production"){   
    console.log('Development Mode')
}


const port = process.env.PORT || 5000;


app.listen(port , () => {
    console.log(`${port}포트 포트로 이동중.....`)
})