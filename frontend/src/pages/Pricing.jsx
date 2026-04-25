import React from "react";
import { Link } from "react-router-dom";
import { Check, X, ArrowRight, Zap } from "lucide-react";

export default function Pricing(){
  const plans=[
    {name:"Starter",price:"$0",period:"forever",desc:"For individuals exploring AI recruitment.",features:["5 resume uploads/mo","Basic matching","Job feed access","Email support"],cta:"Get Started",highlight:false},
    {name:"Professional",price:"$49",period:"/mo",desc:"For growing teams hiring at scale.",features:["Unlimited resumes","Advanced AI matching","Analytics dashboard","Priority support","API access","Team collaboration"],cta:"Start Free Trial",highlight:true},
    {name:"Enterprise",price:"Custom",period:"",desc:"For organizations with complex needs.",features:["Everything in Pro","SSO & SAML","Custom integrations","Dedicated CSM","SLA guarantee","On-premise option"],cta:"Contact Sales",highlight:false}
  ];
  return <div className="animate-fade-in">
    <section style={{padding:"4rem 0",background:"linear-gradient(180deg,var(--primary-50) 0%,#fff 100%)"}}>
      <div className="container text-center" style={{maxWidth:"720px"}}>
        <h1 style={{fontSize:"2.5rem",marginBottom:"1rem"}}>Simple, transparent pricing</h1>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7}}>Start free, scale as you grow. No hidden fees.</p>
      </div>
    </section>
    <section style={{padding:"2rem 0 5rem",background:"#fff"}}>
      <div className="container" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:"1.5rem",alignItems:"start"}}>
        {plans.map(p=>(
          <div key={p.name} className="card-elevated" style={{padding:"2rem",position:"relative",border:p.highlight?"2px solid var(--accent-500)":"1px solid var(--border-light)"}}>
            {p.highlight&&<div className="badge badge-success" style={{position:"absolute",top:"-12px",left:"50%",transform:"translateX(-50%)",fontSize:"0.75rem"}}><Zap size={12}/> Most Popular</div>}
            <h3 style={{fontSize:"1.1rem",fontWeight:700,color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.05em"}}>{p.name}</h3>
            <div className="flex" style={{gap:"0.25rem",alignItems:"baseline",margin:"0.75rem 0"}}>
              <span style={{fontSize:"2.5rem",fontWeight:800}}>{p.price}</span>
              <span style={{color:"var(--text-muted)",fontSize:"0.95rem"}}>{p.period}</span>
            </div>
            <p style={{color:"var(--text-muted)",fontSize:"0.9rem",marginBottom:"1.5rem"}}>{p.desc}</p>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.6rem",marginBottom:"1.5rem"}}>
              {p.features.map(f=><li key={f} className="flex" style={{gap:"0.5rem",alignItems:"center",fontSize:"0.9rem"}}><Check size={16} style={{color:"var(--accent-600)",flexShrink:0}}/>{f}</li>)}
            </ul>
            <Link to={p.name==="Enterprise"?"/contact":"/signup"} className={`btn btn-lg ${p.highlight?"btn-accent":"btn-secondary"}`} style={{width:"100%"}}>{p.cta}{p.highlight&&<ArrowRight size={16}/>}</Link>
          </div>
        ))}
      </div>
    </section>
  </div>;
}
