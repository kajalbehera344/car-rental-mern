import React,{useEffect,useState} from 'react';
import {Routes,Route,Link,useNavigate} from 'react-router-dom';
import api from './api';

function Nav(){
  const navigate=useNavigate();
  const user=JSON.parse(localStorage.getItem('user')||'null');
  const logout=()=>{localStorage.clear();navigate('/');};
  return <nav>
    <Link className="logo" to="/">DriveEasy</Link>
    <div>
      <Link to="/">Cars</Link>
      {user && <Link to="/bookings">My Bookings</Link>}
      {!user ? <><Link to="/login">Login</Link><Link to="/register">Register</Link></> :
      <button onClick={logout}>Logout</button>}
    </div>
  </nav>
}

function Home(){
  const [cars,setCars]=useState([]),[search,setSearch]=useState('');
  const load=()=>api.get('/cars',{params:{search}}).then(r=>setCars(r.data));
  useEffect(()=>{load()},[]);
  return <div>
    <section className="hero"><h1>Rent a car. Drive anywhere.</h1><p>Simple, affordable car rentals for your next journey.</p></section>
    <div className="toolbar"><input placeholder="Search by car or brand" value={search} onChange={e=>setSearch(e.target.value)}/><button onClick={load}>Search</button></div>
    <div className="grid">{cars.map(car=><div className="card" key={car._id}>
      <img src={car.image} /><h2>{car.brand} {car.name}</h2><p>{car.year} • {car.seats} seats • {car.fuel}</p>
      <strong>₹{car.pricePerDay}/day</strong><br/><Link className="primary" to={`/cars/${car._id}`}>View & Book</Link>
    </div>)}</div>
  </div>
}

function Auth({register=false}){
  const [form,setForm]=useState({name:'',email:'',password:''}); const [msg,setMsg]=useState('');
  const navigate=useNavigate();
  const submit=async e=>{e.preventDefault();try{
    if(register){await api.post('/auth/register',form);navigate('/login');}
    else {const r=await api.post('/auth/login',form);localStorage.setItem('token',r.data.token);localStorage.setItem('user',JSON.stringify(r.data.user));navigate('/');}
  }catch(e){setMsg(e.response?.data?.message||'Something went wrong')}}
  return <div className="formbox"><h1>{register?'Create account':'Login'}</h1>{msg&&<p className="error">{msg}</p>}
    <form onSubmit={submit}>{register&&<input placeholder="Name" required onChange={e=>setForm({...form,name:e.target.value})}/>}
    <input type="email" placeholder="Email" required onChange={e=>setForm({...form,email:e.target.value})}/>
    <input type="password" placeholder="Password" required onChange={e=>setForm({...form,password:e.target.value})}/>
    <button className="primary" type="submit">{register?'Register':'Login'}</button></form>
  </div>
}

function Details(){
  const id=location.pathname.split('/').pop(); const [car,setCar]=useState(null); const [dates,setDates]=useState({startDate:'',endDate:''}); const [msg,setMsg]=useState('');
  useEffect(()=>{api.get(`/cars/${id}`).then(r=>setCar(r.data))},[id]);
  if(!car)return <p>Loading...</p>;
  const book=async()=>{try{const r=await api.post('/bookings',{carId:id,...dates});setMsg(`Booked successfully. Total: ₹${r.data.totalPrice}`)}catch(e){setMsg(e.response?.data?.message||'Booking failed')}};
  return <div className="details"><img src={car.image}/><div><h1>{car.brand} {car.name}</h1><p>{car.year} • {car.seats} seats • {car.fuel}</p><h2>₹{car.pricePerDay}/day</h2>
    <input type="date" onChange={e=>setDates({...dates,startDate:e.target.value})}/><input type="date" onChange={e=>setDates({...dates,endDate:e.target.value})}/><button className="primary" onClick={book}>Book Car</button>{msg&&<p>{msg}</p>}
  </div></div>
}

function Bookings(){
 const [items,setItems]=useState([]);
 const load=()=>api.get('/bookings/my').then(r=>setItems(r.data)).catch(()=>{});
 useEffect(load,[]);
 const cancel=async id=>{await api.patch(`/bookings/${id}/cancel`);load()};
 return <div><h1>My Bookings</h1><div className="grid">{items.map(b=><div className="card" key={b._id}><img src={b.car.image}/><h2>{b.car.brand} {b.car.name}</h2><p>{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</p><p>Total: ₹{b.totalPrice}</p><p>Status: {b.status}</p>{b.status==='booked'&&<button onClick={()=>cancel(b._id)}>Cancel</button>}</div>)}</div></div>
}

export default function App(){
 return <><Nav/><main><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth/>}/><Route path="/register" element={<Auth register/>}/><Route path="/cars/:id" element={<Details/>}/><Route path="/bookings" element={<Bookings/>}/></Routes></main></>
}
