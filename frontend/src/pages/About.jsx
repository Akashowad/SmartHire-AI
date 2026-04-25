import React from "react";
import { Users, Target, Shield, Lightbulb } from "lucide-react";

export default function About(){
  const values=[
    {icon:<Target size={24}/>,title:"Precision",desc:"Measure what matters and act on it."},
    {icon:<Shield size={24}/>,title:"Trust",desc:"Security and transparency in everything we build."},
    {icon:<Users size={24}/>,title:"People First",desc:"Tools should help people, not replace them."},
    {icon:<Lightbulb size={24}/>,title:"Innovation",desc:"Always looking for better ways to hire."}
  ];
  const stats=[{v:"2021",l:"Started"},{v:"12",l:"Teams Using It"},{v:"40k+",l:"Resumes Parsed"},{v:"3",l:"Engineers"}];
  return <div className="animate-fade-in">
    <section style={{padding:"4rem 0",background:"linear-gradient(180deg,var(--primary-50) 0%,#fff 100%)"}}>
      <div className="container" style={{maxWidth:"720px"}}>
        <h1 style={{fontSize:"2.5rem",marginBottom:"1rem"}}>About SmartHire AI</h1>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7,marginBottom:"1.5rem"}}>SmartHire started as a tool to solve our own recruiting headaches. We were spending too much time reading resumes and not enough time talking to good candidates. So we built something to fix that.</p>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7}}>The goal is simple: get the right people in front of the right hiring managers faster, with less manual work.</p>
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
