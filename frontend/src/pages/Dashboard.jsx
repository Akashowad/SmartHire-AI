import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import JobCard from "../components/JobCard";
import UploadModal from "../components/UploadModal";
import ApplicationAssistant from "../components/ApplicationAssistant";
import AnalysisResult from "../components/AnalysisResult";
import { apiClient } from "../api";
import { Search, MapPin, LogOut, Brain, Briefcase, BarChart3, Zap } from "lucide-react";

export default function Dashboard(){
  const {jobs,fetchJobs,resumeData,clearResume,applications,fetchApplications,loading,error,analyzeResume}=useApp();
  const {user,logoutUser}=useAuth();
  const nav=useNavigate();
  const [selJob,setSelJob]=useState(null);
  const [kw,setKw]=useState(resumeData?.extracted_skills?.[0]||"");
  const [loc,setLoc]=useState("");
  const [appAll,setAppAll]=useState(false);
  const [analysis,setAnalysis]=useState(null);
  const [analyzing,setAnalyzing]=useState(false);
  const [selAna,setSelAna]=useState(null);

  useEffect(()=>{if(resumeData){fetchJobs(kw,loc);fetchApplications();}},[resumeData?.id]);

  const hSearch=(e)=>{e.preventDefault();fetchJobs(kw,loc);};
  const hAutoApply=async()=>{
    const applied=new Set(applications.map(a=>a.job_id));
    const toApply=jobs.filter(j=>!applied.has(j.id)).slice(0,3);
    if(toApply.length===0)return;
    setAppAll(true);
    for(const job of toApply){try{await apiClient(`/applications/apply?resume_id=${resumeData.id}&job_id=${job.id}`,{method:"POST"});}catch(e){console.error(e);}}
    setAppAll(false);fetchApplications();
  };
  const hAnalyze=async()=>{
    if(!resumeData||!selAna)return;
    setAnalyzing(true);
    try{const r=await analyzeResume(resumeData.text_content,selAna.description);setAnalysis(r);}
    catch(err){console.error(err);alert("Analysis failed.");}
    finally{setAnalyzing(false);}
  };
  const hLogout=()=>{logoutUser();clearResume();nav("/login");};

  if(!resumeData)return <UploadModal/>;

  return <div className="animate-fade-in" style={{background:"var(--bg-body)",minHeight:"100vh"}}>
    <div className="container" style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:"2rem",padding:"2rem 1.5rem"}}>
      <aside className="flex-col" style={{gap:"1rem"}}>
        <div className="card" style={{padding:"1.25rem"}}>
          <div className="flex-between mb-2"><h3 style={{fontSize:"1rem",fontWeight:700}}>Profile</h3><button onClick={clearResume} className="btn btn-ghost btn-sm">Reset</button></div>
          <p style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>{resumeData.original_filename}</p>
          {user&&<div className="mt-2" style={{fontSize:"0.8rem",color:"var(--text-muted)"}}>Logged in as <strong style={{color:"var(--text-heading)"}}>{user.username}</strong><button onClick={hLogout} className="btn btn-ghost btn-sm" style={{marginTop:"0.5rem"}}><LogOut size={14}/> Logout</button></div>}
          <div className="mt-3">
            <h4 style={{fontSize:"0.7rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:700,marginBottom:"0.5rem"}}>Skills</h4>
            <div className="flex flex-wrap gap-1">{resumeData.extracted_skills.map((s,i)=><span key={i} className="badge badge-muted">{s}</span>)}</div>
          </div>
        </div>
        <div className="card" style={{padding:"1.25rem"}}>
          <h4 style={{fontSize:"0.7rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:700,marginBottom:"0.75rem"}}>AI Analysis</h4>
          <p style={{fontSize:"0.85rem",color:"var(--text-muted)",marginBottom:"0.75rem"}}>Select a job and run full analysis.</p>
          <select className="input" style={{marginBottom:"0.75rem",fontSize:"0.85rem"}} value={selAna?.id||""} onChange={e=>{const j=jobs.find(x=>x.id===e.target.value);setSelAna(j||null);}}>
            <option value="">Select a job...</option>
            {jobs.map(j=><option key={j.id} value={j.id}>{j.title} @ {j.company}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" style={{width:"100%"}} onClick={hAnalyze} disabled={analyzing||!selAna}>{analyzing?<div className="spinner" style={{width:"14px",height:"14px"}}/>:<Brain size={14}/>} {analyzing?"Analyzing...":"Run Analysis"}</button>
        </div>
        <div className="card" style={{padding:"1.25rem"}}>
          <h4 style={{fontSize:"0.7rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:700,marginBottom:"0.5rem"}}>Applications</h4>
          <div style={{fontSize:"1.75rem",fontWeight:800}}>{applications.length}</div>
        </div>
      </aside>

      <main className="flex-col" style={{gap:"1.25rem"}}>
        <div className="flex-between" style={{flexWrap:"wrap",gap:"1rem"}}>
          <div><h2 style={{fontSize:"1.5rem",fontWeight:700}}>Opportunities</h2><p style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>Real-time listings from Remotive</p></div>
          <button className="btn btn-accent btn-sm" onClick={hAutoApply} disabled={appAll||jobs.length===0}>{appAll?<div className="spinner" style={{width:"14px",height:"14px"}}/>:<Zap size={14}/>} Auto-Apply Top 3</button>
        </div>
        <form onSubmit={hSearch} className="card flex" style={{padding:"0.5rem",gap:"0.5rem",alignItems:"center"}}>
          <div className="flex" style={{flex:1,alignItems:"center",gap:"0.5rem",padding:"0 0.75rem"}}><Search size={16} style={{color:"var(--text-muted)"}}/><input type="text" className="input" style={{border:"none",background:"transparent",padding:0}} placeholder="Keywords" value={kw} onChange={e=>setKw(e.target.value)}/></div>
          <div style={{width:"1px",height:"28px",background:"var(--border-light)"}}/>
          <div className="flex" style={{flex:1,alignItems:"center",gap:"0.5rem",padding:"0 0.75rem"}}><MapPin size={16} style={{color:"var(--text-muted)"}}/><input type="text" className="input" style={{border:"none",background:"transparent",padding:0}} placeholder="Location" value={loc} onChange={e=>setLoc(e.target.value)}/></div>
          <button type="submit" className="btn btn-primary btn-sm">Find Jobs</button>
        </form>
        {loading?(<div className="flex-col flex-center" style={{minHeight:"300px",gap:"1rem"}}><div className="spinner" style={{width:"36px",height:"36px"}}/><p style={{color:"var(--text-muted)"}}>Scanning job boards...</p></div>)
        :error?(<div className="card text-center" style={{padding:"3rem",border:"1px solid var(--danger-500)"}}><p style={{color:"var(--danger-500)"}}>{error}</p><button onClick={()=>fetchJobs()} className="btn btn-secondary mt-2">Retry</button></div>)
        :jobs.length===0?(<div className="card text-center" style={{padding:"3rem"}}><p style={{color:"var(--text-muted)"}}>No jobs found. Try different keywords.</p></div>)
        :(<div className="flex-col" style={{gap:"1rem"}}>{jobs.map(j=><JobCard key={j.id} job={j} onAssist={()=>setSelJob(j)}/>)}</div>)
        }
      </main>
    </div>
    {selJob&&<ApplicationAssistant job={selJob} resumeText={resumeData.text_content} onClose={()=>setSelJob(null)}/>}
    {analysis&&<AnalysisResult data={analysis} onClose={()=>setAnalysis(null)}/>}
  </div>;
}
