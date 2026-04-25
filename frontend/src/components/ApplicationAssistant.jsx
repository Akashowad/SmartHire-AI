import React, { useState, useEffect } from "react";
import { apiClient } from "../api";
import { X, Copy, CheckCircle, Sparkles } from "lucide-react";

export default function ApplicationAssistant({job,resumeText,onClose}){
  const [load,setLoad]=useState(true);
  const [data,setData]=useState(null);
  const [copied,setCopied]=useState(null);
  useEffect(()=>{
    const f=async()=>{
      try{const b={resume_text:resumeText,job_description:job.description};
        const [rec,cov]=await Promise.all([apiClient("/ai/recommendations",{method:"POST",body:b}),apiClient("/ai/cover-letter",{method:"POST",body:b})]);
        setData({recommendations:rec,coverLetter:cov});}
      catch(err){console.error(err);}
      finally{setLoad(false);}};
    f();
  },[job,resumeText]);
  const copy=(text,type)=>{navigator.clipboard.writeText(text);setCopied(type);setTimeout(()=>setCopied(null),2000);};
  return <div className="flex-center animate-fade-in" style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(15,23,42,0.5)",backdropFilter:"blur(8px)",zIndex:2000,padding:"2rem"}}>
    <div className="card-elevated flex-col" style={{width:"100%",maxWidth:"800px",maxHeight:"90vh",padding:"2.5rem",position:"relative",overflowY:"auto",background:"#fff"}}>
      <button onClick={onClose} style={{position:"absolute",top:"1.25rem",right:"1.5rem",background:"none",border:"none",color:"var(--text-muted)",cursor:"pointer"}}><X size={24}/></button>
      <div style={{marginBottom:"1.5rem"}}>
        <h2 style={{fontSize:"1.5rem",fontWeight:800,display:"flex",alignItems:"center",gap:"0.5rem"}}><Sparkles size={22} style={{color:"var(--accent-600)"}}/> AI Apply Assist</h2>
        <p style={{color:"var(--text-muted)",marginTop:"0.35rem"}}>Strategy for <strong>{job.title}</strong> at {job.company}</p>
      </div>
      {load?(<div className="flex-col flex-center" style={{minHeight:"300px",gap:"1rem"}}><div className="spinner" style={{width:"40px",height:"40px"}}/><p style={{color:"var(--text-muted)"}}>Generating tailored materials...</p></div>)
      :data?(<div className="flex-col" style={{gap:"1.5rem"}}>
        <div className="card" style={{padding:"1.25rem",borderLeft:"4px solid var(--accent-500)"}}>
          <h4 style={{fontSize:"1rem",fontWeight:700,color:"var(--accent-600)",marginBottom:"0.5rem"}}>Match Intelligence</h4>
          <p style={{fontSize:"0.95rem",lineHeight:1.6}}>{data.recommendations.why_matches}</p>
          {data.recommendations.skills_to_improve.length>0&&<div style={{marginTop:"0.75rem"}}><strong style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>Skill gaps:</strong><div className="flex flex-wrap gap-2" style={{marginTop:"0.35rem"}}>{data.recommendations.skills_to_improve.map((sk,i)=><span key={i} className="badge badge-muted">{sk}</span>)}</div></div>}
        </div>
        <div>
          <div className="flex-between" style={{marginBottom:"0.5rem"}}><h4 style={{fontSize:"0.8rem",textTransform:"uppercase",color:"var(--text-muted)",fontWeight:700}}>Cover Letter</h4><button onClick={()=>copy(data.coverLetter.cover_letter,"cv")} className="btn btn-secondary btn-sm">{copied==="cv"?<><CheckCircle size={14}/> Copied</>:<><Copy size={14}/> Copy</>}</button></div>
          <div className="card" style={{padding:"1.25rem",fontSize:"0.9rem",lineHeight:1.7,maxHeight:"280px",overflowY:"auto",background:"var(--primary-50)"}}>{data.coverLetter.cover_letter.split("\n").map((ln,i)=><p key={i} style={{marginBottom:ln?"0.75rem":"0.25rem"}}>{ln}</p>)}</div>
        </div>
        <div>
          <div className="flex-between" style={{marginBottom:"0.5rem"}}><h4 style={{fontSize:"0.8rem",textTransform:"uppercase",color:"var(--text-muted)",fontWeight:700}}>Recruiter Email</h4><button onClick={()=>copy(data.coverLetter.email_template,"em")} className="btn btn-secondary btn-sm">{copied==="em"?<><CheckCircle size={14}/> Copied</>:<><Copy size={14}/> Copy</>}</button></div>
          <pre style={{padding:"1.25rem",borderRadius:"var(--radius-md)",background:"var(--primary-50)",border:"1px solid var(--border-light)",whiteSpace:"pre-wrap",fontSize:"0.9rem",fontFamily:"var(--font-sans)"}}>{data.coverLetter.email_template}</pre>
        </div>
      </div>):(<div className="card text-center" style={{padding:"3rem"}}><p style={{color:"var(--danger-500)"}}>Failed to connect with AI services.</p></div>)}
    </div>
  </div>;
}
