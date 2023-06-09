if(process.env.NODE_ENV !== "production"){
    require('dotenv').config(); //Adds the .env variables in process.env
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session=require('express-session');
const flash = require('connect-flash');
const { campgroundSchema , reviewSchema} = require('./schemas.js');
const Joi =require('joi');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');
const cathcAsync= require('./utils/catchAsync');
const ExpressError= require('./utils/ExpressError');
const campgroundRoutes= require('./routes/campgrounds');
const reviewRoutes= require('./routes/reviews');
const userRoutes = require('./routes/users');
const passport=require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig = {
    store: MongoStore.create({ mongoUrl: dbUrl}),
    name:'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // if(!['/login','/'].includes(req.originalUrl)){
    //     req.session.returnTo = req.originalUrl;
    // }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
});

app.all('*',(req,res,next)=>{
    next(new ExpressError('page not found'),404)
})

app.use((err,req,res,next)=>{
    const {status=400}=err;
    if(!err.message) err.message="oh u fucked up";
    res.status(status).render('error',{err});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})