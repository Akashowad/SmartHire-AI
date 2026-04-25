import React, { useState, useEffect } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

const STEPS=[
  {id:"profile",label:"Analyzing profile fit",icon:"1"},
  {id:"tailor",label:"Tailoring application",icon:"2"},
  {id:"draft",label:"Generating cover letter",icon:"3"},
  {id:"submit",label:"Submitting application",icon:"4"}
];

export default function AutoApplyProgress({job,onComplete}){
  const [step,setStep]=useState(0);
  useEffect(()=>{if(step<STEPS.length){const t=setTimeout(()=>setStep(s=>s+1),1200);return()=>clearTimeout(t);}else{onComplete?.();}},[step]);
  return <div className="flex-center animate-fade-in" style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.5)",backdropFilter:"blur(8px)",zIndex:2000,padding:"2rem"}}>
    <div className="card-elevated text-center" style={{maxWidth:"480px",width:"100%",padding:"3rem"}}>
      <h2 style={{fontSize:"1.5rem",fontWeight:800,marginBottom:"0.5rem"}}>AI Auto-Apply</h2>
      <p style={{color:"var(--text-muted)",marginBottom:"2rem"}}>Applying to <strong>{job.title}</strong> at {job.company}</p>
      <div className="flex-col" style={{gap:"1rem",textAlign:"left"}}>
        {STEPS.map((s,i)=>{
          const done=i<step,curr=i===step;
          return <div key={s.id} className="flex-between" style={{opacity:done||curr?1:0.4,transition:"all 0.3s ease",padding:"0.75rem 1rem",borderRadius:"var(--radius-sm)",background:curr?"var(--primary-50)":"transparent",border:curr?"1px solid var(--border-light)":"1px solid transparent"}}>
            <span className="flex" style={{gap:"0.75rem",alignItems:"center"}}>
              <span style={{width:"24px",height:"24px",borderRadius:"50%",background:done?"var(--accent-500)":curr?"var(--primary-900)":"var(--primary-200)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.75rem",fontWeight:700}}>
                {done?<CheckCircle size={14}/>:s.icon}
              </span>
              <span style={{fontWeight:curr?600:400,color:curr?"var(--text-heading)":"var(--text-muted)"}}>{s.label}</span>
            </span>
            {done&&<CheckCircle size={16} style={{color:"var(--accent-500)"}}/>}
            {curr&&<Loader2 size={16} className="spinner" style={{width:"16px",height:"16px",border:"none",animation:"spin 1s linear infinite"}}/>}
          </div>;
        })}
      </div>
      <div style={{height:"4px",background:"var(--primary-100)",borderRadius:"2px",overflow:"hidden",marginTop:"1.5rem"}}>
        <div style={{height:"100%",background:"var(--accent-500)",width:`${(step/STEPS.length)*100}%`,transition:"width 0.4s ease"}}/>
      </div>
    </div>
  </div>;
}
