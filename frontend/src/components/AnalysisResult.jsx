import React, { useState } from "react";
import { X, ChevronDown, ChevronUp, Target } from "lucide-react";

function ScoreRing({score}){
  const r=45,c=2*Math.PI*r,o=c-(score/100)*c,col=score>70?"var(--accent-600)":score>40?"var(--warning-500)":"var(--danger-500)";
  return <div style={{position:"relative",width:"110px",height:"110px"}}>
    <svg width="110" height="110" style={{transform:"rotate(-90deg)"}}>
      <circle cx="55" cy="55" r={r} stroke="var(--primary-200)" strokeWidth="10" fill="none"/>
      <circle cx="55" cy="55" r={r} stroke={col} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={o} style={{transition:"stroke-dashoffset 0.8s ease-out"}}/>
    </svg>
    <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
      <span style={{fontSize:"1.5rem",fontWeight:800,color:col}}>{Math.round(score)}%</span>
      <span style={{fontSize:"0.65rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:600}}>Match</span>
    </div>
  </div>;
}

function Section({title,icon,children}){
  const [open,setOpen]=useState(true);
  return <div className="card" style={{padding:"1.25rem",borderLeft:"3px solid var(--accent-500)"}}>
    <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",color:"var(--text-heading)",fontSize:"1rem",fontWeight:700,cursor:"pointer",padding:0}}>
      <span className="flex" style={{gap:"0.5rem",alignItems:"center"}}>{icon} {title}</span>
      {open?<ChevronDown size={18} style={{color:"var(--text-muted)"}}/>:<ChevronUp size={18} style={{color:"var(--text-muted)"}}/>}
    </button>
    {open&&<div style={{marginTop:"1rem"}}>{children}</div>}
  </div>;
}

function Bullets({items,col="var(--text-body)"}){
  if(!items||items.length===0)return <p style={{fontSize:"0.9rem",color:"var(--text-muted)"}}>None identified.</p>;
  return <ul style={{paddingLeft:"1.2rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>{items.map((it,i)=><li key={i} style={{fontSize:"0.92rem",lineHeight:1.5,color:col}}>{it}</li>)}</ul>;
}

export default function AnalysisResult({data,onClose}){
  if(!data)return null;
  return <div className="flex-center animate-fade-in" style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.6)",backdropFilter:"blur(8px)",zIndex:3000,padding:"2rem",overflowY:"auto"}}>
    <div className="card-elevated flex-col" style={{width:"100%",maxWidth:"850px",padding:"2.5rem",position:"relative",gap:"1.5rem",background:"#fff"}}>
      <button onClick={onClose} style={{position:"absolute",top:"1.25rem",right:"1.5rem",background:"none",border:"none",color:"var(--text-muted)",fontSize:"1.5rem",cursor:"pointer"}}><X size={24}/></button>
      <div className="flex-between" style={{alignItems:"flex-start",flexWrap:"wrap",gap:"1.5rem"}}>
        <div><h2 style={{fontSize:"1.75rem",fontWeight:800}}>AI Analysis Report</h2><p style={{color:"var(--text-muted)"}}>Complete hiring analysis</p></div>
        <ScoreRing score={data.match_score||0}/>
      </div>
      <Section title="Strengths" icon={<Target size={18} style={{color:"var(--accent-600)"}}/>}><Bullets items={data.strengths} col="var(--accent-600)"/></Section>
      <Section title="Missing Skills" icon={<Target size={18} style={{color:"var(--danger-500)"}}/>}><Bullets items={data.missing_skills} col="var(--danger-500)"/></Section>
      <Section title="Improvement Suggestions" icon={<Target size={18} style={{color:"var(--info-500)"}}/>}><Bullets items={data.improvement_suggestions}/></Section>
      <Section title="ATS Keywords" icon={<Target size={18} style={{color:"var(--warning-500)"}}/>}>
        <div className="flex flex-wrap gap-2">{data.ats_keywords?.map((kw,i)=><span key={i} className="badge badge-info">{kw}</span>)}</div>
      </Section>
      <Section title="Interview Questions" icon={<Target size={18} style={{color:"var(--primary-600)"}}/>}>
        <div className="flex-col gap-3">
          <div><h4 style={{fontSize:"0.8rem",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.5rem",fontWeight:700}}>Technical</h4><Bullets items={data.interview_questions?.technical}/></div>
          <div><h4 style={{fontSize:"0.8rem",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.5rem",fontWeight:700}}>HR</h4><Bullets items={data.interview_questions?.hr}/></div>
          <div><h4 style={{fontSize:"0.8rem",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:"0.5rem",fontWeight:700}}>Scenario</h4><Bullets items={data.interview_questions?.scenario}/></div>
        </div>
      </Section>
    </div>
  </div>;
}
