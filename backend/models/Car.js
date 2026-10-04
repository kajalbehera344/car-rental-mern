import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name:{type:String,required:true},
  brand:{type:String,required:true},
  year:{type:Number,required:true},
  pricePerDay:{type:Number,required:true},
  image:{type:String,default:'https://images.unsplash.com/photo-1503376780353-7e6692767b70'},
  seats:{type:Number,default:5},
  fuel:{type:String,default:'Petrol'},
  available:{type:Boolean,default:true}
},{timestamps:true});

export default mongoose.model('Car',carSchema);
