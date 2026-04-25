import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api";
import { useAuth } from "../context/AuthContext";
import { Briefcase } from "lucide-react";

export default function Signup() {
  const [u,setU]=useState("");const [em,setEm]=useState("");const [p,setP]=useState("");const [cp,setCp]=useState("");
  const [err,setE]=useState("");const [load,setL]=useState(false);
  const {loginUser}=useAuth();const nav=useNavigate();
  const h=async(e)=>{e.preventDefault();setL(true);setE("");
    if(p!==cp){setE("Passwords do not match");setL(false);return;}
    try{const d=await signup(u,em,p);loginUser({username:u,email:em},d.access_token);nav("/dashboard");}
    catch(x){setE(x.message||"Signup failed");}finally{setL(false);}};
  return (
    <div className="animate-fade-in" style={{padding:"4rem 1rem"}}>
      <div className="container" style={{maxWidth:"400px"}}>
        <div className="text-center mb-4">
          <div style={{width:"48px",height:"48px",background:"var(--primary-900)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem"}}><Briefcase size={24} color="#fff"/></div>
          <h1 style={{fontSize:"1.75rem",fontWeight:800}}>Create your account</h1>
          <p style={{color:"var(--text-muted)"}}>Start your 14-day free trial today</p>
        </div>
        {err&&<div className="alert alert-danger mb-3">{err}</div>}
        <form onSubmit={h} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div><label style={{fontSize:"0.85rem",fontWeight:600,display:"block",marginBottom:"0.35rem"}}>Username</label><input type="text" className="input" value={u} onChange={e=>setU(e.target.value)} required minLength={3} placeholder="Choose a username"/></div>
          <div><label style={{fontSize:"0.85rem",fontWeight:600,display:"block",marginBottom:"0.35rem"}}>Email</label><input type="email" className="input" value={em} onChange={e=>setEm(e.target.value)} required placeholder="you@company.com"/></div>
          <div><label style={{fontSize:"0.85rem",fontWeight:600,display:"block",marginBottom:"0.35rem"}}>Password</label><input type="password" className="input" value={p} onChange={e=>setP(e.target.value)} required minLength={6} placeholder="Min 6 characters"/></div>
          <div><label style={{fontSize:"0.85rem",fontWeight:600,display:"block",marginBottom:"0.35rem"}}>Confirm Password</label><input type="password" className="input" value={cp} onChange={e=>setCp(e.target.value)} required placeholder="Re-enter your password"/></div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={load}>{load?<div className="spinner" style={{width:"18px",height:"18px"}}/>:"Create Account"}</button>
        </form>
        <p style={{textAlign:"center",marginTop:"1.5rem",fontSize:"0.9rem",color:"var(--text-muted)"}}>
          Already have an account? <Link to="/login" style={{color:"var(--accent-600)",fontWeight:600,textDecoration:"none"}}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
