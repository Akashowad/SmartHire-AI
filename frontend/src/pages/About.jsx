import React from "react";
import { Users, Target, Shield, Lightbulb } from "lucide-react";

export default function About(){
  const values=[
    {icon:<Target size={24}/>,title:"Precision",desc:"Data-driven decisions with rigorous AI analysis."},
    {icon:<Shield size={24}/>,title:"Trust",desc:"Enterprise security and transparency in every algorithm."},
    {icon:<Users size={24}/>,title:"People First",desc:"Technology amplifies human potential."},
    {icon:<Lightbulb size={24}/>,title:"Innovation",desc:"Pushing boundaries of AI in recruitment."}
  ];
  const stats=[{v:"2019",l:"Founded"},{v:"50+",l:"Clients"},{v:"2M+",l:"Resumes"},{v:"99.9%",l:"Uptime"}];
  return <div className="animate-fade-in">
    <section style={{padding:"4rem 0",background:"linear-gradient(180deg,var(--primary-50) 0%,#fff 100%)"}}>
      <div className="container" style={{maxWidth:"720px"}}>
        <h1 style={{fontSize:"2.5rem",marginBottom:"1rem"}}>About SmartHire AI</h1>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7,marginBottom:"1.5rem"}}>We are building the future of talent acquisition. Founded by AI researchers and former recruiting leaders, SmartHire combines cutting-edge ML with deep industry expertise.</p>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7}}>Our mission: eliminate bias, reduce time-to-hire, and help every company build their dream team.</p>
      </div>
    </section>
    <section style={{padding:"3rem 0",background:"var(--primary-900)",color:"#fff"}}>
      <div className="container" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"2rem",textAlign:"center"}}>
{stats.map(s=><div key={s.l}><div style={{fontSize:"2rem",fontWeight:800,fontFamily:"var(--font-display)"}}>{s.v}</div><div style={{fontSize:"0.85rem",color:"var(--primary-400)",marginTop:"0.25rem"}}>{s.l}</div></div>)}
      </div>
    </section>
    <section style={{padding:"4rem 0",background:"#fff"}}>
      <div className="container">
        <h2 style={{fontSize:"1.75rem",textAlign:"center",marginBottom:"2.5rem"}}>Our Values</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.5rem"}}>
          {values.map(v=>(
            <div key={v.title} className="card" style={{padding:"1.75rem"}}>
              <div style={{width:"40px",height:"40px",background:"var(--accent-50)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem",color:"var(--accent-600)"}}>{v.icon}</div>
              <h3 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:"0.5rem"}}>{v.title}</h3>
              <p style={{fontSize:"0.9rem",color:"var(--text-muted)",lineHeight:1.6}}>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>;
}
