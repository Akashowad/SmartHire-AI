import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../api";
import { ExternalLink, CheckCircle, Sparkles } from "lucide-react";

export default function JobCard({ job, onAssist }) {
  const { resumeData, applications } = useApp();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const isApplied = applications.some(a => a.job_id === job.id);
  const score = match?.match_percentage || 0;
  const sc = score>70 ? "var(--accent-600)" : score>40 ? "var(--warning-500)" : "var(--danger-500)";
  useEffect(()=>{if(resumeData?.id){setLoading(true);apiClient(`/matches/?resume_id=${resumeData.id}&job_id=${job.id}`,{method:"POST"}).then(d=>setMatch(d)).catch(()=>{}).finally(()=>setLoading(false));}},[job.id,resumeData?.id]);
  return (
    <div className="card" style={{padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
      <div className="flex-between" style={{alignItems:"flex-start"}}>
        <div className="flex" style={{gap:"1rem",alignItems:"center"}}>
          {job.company_logo&&<img src={job.company_logo} alt={job.company} style={{width:"44px",height:"44px",borderRadius:"8px",objectFit:"contain",background:"#fff",border:"1px solid var(--border-light)",padding:"2px"}} onError={e=>e.target.style.display="none"}/>}
          <div>
            <h3 style={{fontSize:"1.05rem",fontWeight:700,marginBottom:"0.15rem"}}>{job.title}</h3>
            <p style={{fontSize:"0.85rem",color:"var(--text-muted)"}}>{job.company} &bull; {job.location}</p>
          </div>
        </div>
        <div className="text-center">
          <div style={{fontSize:"1.2rem",fontWeight:800,color:sc}}>{loading ? "-" : `${Math.round(score)}%`}</div>
          <div style={{fontSize:"0.65rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:600}}>Match</div>
        </div>
      </div>
      <p style={{fontSize:"0.9rem",color:"var(--text-muted)",lineHeight:1.6}}>{job.excerpt||job.description?.substring(0,160)+"..."}</p>
      <div className="flex-between" style={{flexWrap:"wrap",gap:"0.75rem"}}>
        <div className="flex" style={{gap:"0.5rem",alignItems:"center"}}>
          {isApplied&&<span className="badge badge-success"><CheckCircle size={12}/> Applied</span>}
          {job.salary&&<span style={{fontSize:"0.85rem",color:"var(--accent-600)",fontWeight:700}}>{job.salary}</span>}
        </div>
        <div className="flex" style={{gap:"0.5rem"}}>
          <button className="btn btn-secondary btn-sm" onClick={onAssist}><Sparkles size={14}/> Assist</button>
          <a href={job.apply_url||"#"} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm"><ExternalLink size={14}/> Apply</a>
        </div>
      </div>
    </div>
  );
}
