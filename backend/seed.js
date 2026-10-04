import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from './models/Car.js';
dotenv.config();
await mongoose.connect(process.env.MONGO_URI);
await Car.deleteMany({});
await Car.insertMany([
{name:'Model 3',brand:'Tesla',year:2024,pricePerDay:4500,seats:5,fuel:'Electric',image:'https://images.unsplash.com/photo-1560958089-b8a1929cea89'},
{name:'C-Class',brand:'Mercedes',year:2023,pricePerDay:6500,seats:5,fuel:'Petrol',image:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8'},
{name:'Creta',brand:'Hyundai',year:2024,pricePerDay:2200,seats:5,fuel:'Diesel',image:'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6'}
]);
console.log('Cars seeded');
process.exit();
