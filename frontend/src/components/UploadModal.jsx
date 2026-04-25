import React, { useState } from "react";
import { apiClient } from "../api";
import { useApp } from "../context/AppContext";
import { Upload, FileText, X } from "lucide-react";

export default function UploadModal({ onUploadSuccess }) {
  const { updateResume, setLoading, setError } = useApp();
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const hChange = e => { const f = e.target.files[0]; if(f) setFile(f); };
  const hUpload = async () => {
    if(!file) return; setLoading(true); setError(null);
    const fd = new FormData(); fd.append("file", file);
    try { const d = await apiClient("/resumes/upload-resume", {method:"POST", body:fd}); updateResume(d); onUploadSuccess?.(); }
    catch(err){ setError(err.message || "Upload failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className="animate-fade-in" style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",background:"linear-gradient(135deg,var(--primary-50) 0%,#f1f5f9 100%)"}}>
      <div className="card-elevated" style={{width:"100%",maxWidth:"480px",padding:"2.5rem"}}>
        <div className="text-center mb-4">
          <div style={{width:"56px",height:"56px",background:"var(--accent-50)",borderRadius:"14px",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 1rem"}}>
            <FileText size={26} style={{color:"var(--accent-600)"}}/>
          </div>
          <h2 style={{fontSize:"1.5rem",fontWeight:800}}>Upload your resume</h2>
          <p style={{color:"var(--text-muted)",fontSize:"0.95rem",marginTop:"0.5rem"}}>We will analyze your skills and match you with relevant opportunities.</p>
        </div>
        <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);const d=e.dataTransfer.files[0];if(d)setFile(d);}}
          style={{border:`2px dashed ${drag?"var(--accent-500)":"var(--border-medium)"}`,borderRadius:"var(--radius-md)",padding:"2.5rem 1.5rem",textAlign:"center",background:drag?"var(--accent-50)":"var(--primary-50)",transition:"var(--transition-base)",display:"flex",flexDirection:"column",alignItems:"center",gap:"1rem",cursor:"pointer"}}
          onClick={()=>document.getElementById("fu").click()}>
          <Upload size={32} style={{color:drag?"var(--accent-600)":"var(--primary-400)"}}/>
          <div>
            <p style={{fontWeight:600,fontSize:"1rem"}}>{file?file.name:"Click or drag resume here"}</p>
            <p style={{fontSize:"0.8rem",color:"var(--text-muted)",marginTop:"0.25rem"}}>PDF or DOCX, max 10MB</p>
          </div>
        </div>
        <input id="fu" type="file" onChange={hChange} accept=".pdf,.docx,.doc" style={{display:"none"}}/>
        <button className="btn btn-primary btn-lg" style={{width:"100%",marginTop:"1.25rem"}} disabled={!file} onClick={hUpload}>Analyze Resume</button>
      </div>
    </div>
  );
}
