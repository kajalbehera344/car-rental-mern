import express from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import {protect} from '../middleware/auth.js';

const router=express.Router();

router.post('/',protect,async(req,res)=>{
  try{
    const {carId,startDate,endDate}=req.body;
    const start=new Date(startDate), end=new Date(endDate);
    if(start>=end) return res.status(400).json({message:'End date must be after start date'});
    const car=await Car.findById(carId);
    if(!car) return res.status(404).json({message:'Car not found'});

    const conflict=await Booking.findOne({
      car:carId,status:'booked',
      startDate:{$lt:end},endDate:{$gt:start}
    });
    if(conflict) return res.status(400).json({message:'Car is already booked for these dates'});

    const days=Math.max(1,Math.ceil((end-start)/(1000*60*60*24)));
    const booking=await Booking.create({
      user:req.user.id,car:carId,startDate:start,endDate:end,
      totalPrice:days*car.pricePerDay
    });
    res.status(201).json(await booking.populate('car'));
  }catch(e){res.status(500).json({message:e.message});}
});

router.get('/my',protect,async(req,res)=>{
  try{
    res.json(await Booking.find({user:req.user.id}).populate('car').sort({createdAt:-1}));
  }catch(e){res.status(500).json({message:e.message});}
});

router.patch('/:id/cancel',protect,async(req,res)=>{
  try{
    const booking=await Booking.findOne({_id:req.params.id,user:req.user.id});
    if(!booking) return res.status(404).json({message:'Booking not found'});
    booking.status='cancelled';
    await booking.save();
    res.json(booking);
  }catch(e){res.status(500).json({message:e.message});}
});

export default router;
