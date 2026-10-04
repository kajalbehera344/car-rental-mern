import express from 'express';
import Car from '../models/Car.js';
import {protect,adminOnly} from '../middleware/auth.js';

const router=express.Router();

router.get('/',async(req,res)=>{
  try{
    const q=req.query.search||'';
    const cars=await Car.find({
      $or:[
        {name:{$regex:q,$options:'i'}},
        {brand:{$regex:q,$options:'i'}}
      ]
    }).sort({createdAt:-1});
    res.json(cars);
  }catch(e){res.status(500).json({message:e.message});}
});

router.get('/:id',async(req,res)=>{
  try{
    const car=await Car.findById(req.params.id);
    if(!car) return res.status(404).json({message:'Car not found'});
    res.json(car);
  }catch(e){res.status(500).json({message:e.message});}
});

router.post('/',protect,adminOnly,async(req,res)=>{
  try{res.status(201).json(await Car.create(req.body));}
  catch(e){res.status(400).json({message:e.message});}
});

router.delete('/:id',protect,adminOnly,async(req,res)=>{
  try{
    await Car.findByIdAndDelete(req.params.id);
    res.json({message:'Car deleted'});
  }catch(e){res.status(500).json({message:e.message});}
});

export default router;
