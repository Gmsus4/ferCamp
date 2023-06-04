const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedHelpers');
mongoose.connect('mongodb://127.0.0.1:27017/campgroundFer');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({ //Por cada uno de los campamentos creados automáticamente.
            author: '647a1f217a0e9757a4b263ae',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda quisquam ab sapiente, corrupti culpa itaque earum odio mollitia pariatur sint harum aperiam quam ut nihil molestiae. Qui, non laborum! Enim?',
            price: price,
            geometry: {
                type: 'Point',
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'yelcamp'
                },
                {
                    url: 'https://source.unsplash.com/collection/483251',
                    filename: 'yelcamp'
                }
                //549 Campground
            ]
        });
        await camp.save();
    }
}

//seedDB();
seedDB().then(()=> {
    mongoose.connection.close();
})