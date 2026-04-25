import React from "react";
import { Link } from "react-router-dom";
import { Zap, FileText, MessageSquare, BarChart3, Shield, Globe, CheckCircle, ArrowRight } from "lucide-react";

export default function Features(){
  const groups=[
    {i:<Zap size={24} style={{color:"var(--accent-600)"}}/>,t:"AI-Powered Matching",d:"Our hybrid SBERT + TF-IDF engine delivers precise candidate-job compatibility scores.",p:["SBERT + TF-IDF hybrid","Real-time match scores","Skill gap analysis","ATS keyword detection"]},
    {i:<FileText size={24} style={{color:"var(--info-500)"}}/>,t:"Resume Parsing",d:"Extract structured data from PDF and Word using spaCy NLP pipelines.",p:["PDF and DOCX support","Automated skill extraction","Education parsing","Multi-language support"]},
    {i:<MessageSquare size={24} style={{color:"#ec4899"}}/>,t:"AI Apply Assistant",d:"Generate professional application materials with GPT-4.",p:["Personalized cover letters","Recruiter email templates","Interview questions","Resume improvement tips"]},
    {i:<BarChart3 size={24} style={{color:"var(--warning-500)"}}/>,t:"Analytics",d:"Comprehensive dashboards for match scores, pipelines, and velocity.",p:["Match distribution","Funnel tracking","Team dashboards","Exportable reports"]},
    {i:<Shield size={24} style={{color:"var(--danger-500)"}}/>,t:"Enterprise Security",d:"Built for compliance and scale with audit trails.",p:["JWT + bcrypt auth","Role-based access","Audit logs","GDPR ready"]},
    {i:<Globe size={24} style={{color:"#8b5cf6"}}/>,t:"Global Aggregation",d:"Connect to live job feeds from multiple sources.",p:["Remotive API","Keyword filtering","Real-time updates","Custom connectors"]}
  ];
  return <div className="animate-fade-in">
    <section style={{padding:"4rem 0",background:"linear-gradient(180deg,var(--primary-50) 0%,#fff 100%)"}}>
      <div className="container text-center" style={{maxWidth:"720px"}}>
        <h1 style={{fontSize:"2.5rem",marginBottom:"1rem"}}>Powerful features for modern teams</h1>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7,marginBottom:"2rem"}}>Everything you need to source, screen, and hire the best candidates.</p>
        <Link to="/signup" className="btn btn-primary btn-lg">Start Free Trial <ArrowRight size={16}/></Link>
      </div>
    </section>
    <section style={{padding:"3rem 0 5rem",background:"#fff"}}>
      <div className="container" style={{display:"flex",flexDirection:"column",gap:"2rem"}}>
        {groups.map((g,idx)=>(
          <div key={g.t} className="card-elevated" style={{padding:"2rem",display:"grid",gridTemplateColumns:idx%2===0?"1fr 1.2fr":"1.2fr 1fr",gap:"2rem",alignItems:"center"}}>
            <div style={{order:idx%2===0?0:1}}>
              <div style={{width:"48px",height:"48px",background:"var(--primary-50)",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>{g.i}</div>
              <h2 style={{fontSize:"1.35rem",marginBottom:"0.5rem"}}>{g.t}</h2>
              <p style={{color:"var(--text-muted)",lineHeight:1.7,marginBottom:"1rem"}}>{g.d}</p>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                {g.p.map(p=><li key={p} className="flex" style={{gap:"0.5rem",alignItems:"center",fontSize:"0.9rem"}}><CheckCircle size={16} style={{color:"var(--accent-600)",flexShrink:0}}/>{p}</li>)}
              </ul>
            </div>
            <div style={{background:"var(--primary-50)",borderRadius:"var(--radius-lg)",height:"200px",display:"flex",alignItems:"center",justifyContent:"center",order:idx%2===0?1:0}}>
              <div style={{textAlign:"center",color:"var(--primary-300)"}}>{g.i}<p style={{marginTop:"0.5rem",fontSize:"0.8rem",fontWeight:600}}>{g.t}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>;
}
