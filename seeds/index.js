const mongoose = require('mongoose');
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers')

const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample= array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+20;
        const camp = new Campground({
            author:'64019e8788890ee3ffffc1b2',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Camping, forest, campfire, food over fire, coffee, mist, woods, sunsets, lakes, leaves and trees',
            geometry:{
                type:"Point",
                coordinates: [cities[random1000].longitude,cities[random1000].latitude]
            },
            image: [{
                url: 'https://res.cloudinary.com/duzutrso4/image/upload/v1679413381/YelpCamp/bun4mrbevnywehk52p2q.png',
                filename: 'YelpCamp/bun4mrbevnywehk52p2q',
            },
            {
                url: 'https://res.cloudinary.com/duzutrso4/image/upload/v1679413381/YelpCamp/bun4mrbevnywehk52p2q.png',
                filename: 'YelpCamp/bun4mrbevnywehk52p2q',
            }
            ],
            price
        })
        await camp.save();
    }
}

seedDB().then(()=> {
    mongoose.connection.close();
}) 

