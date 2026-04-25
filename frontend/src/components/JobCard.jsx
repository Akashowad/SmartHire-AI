import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { apiClient } from "../api";
import { ExternalLink, CheckCircle, Sparkles, MapPin } from "lucide-react";

export default function JobCard({ job, onAssist }) {
  const { resumeData, applications, fetchApplications } = useApp();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const isApplied = applications.some(a => a.job_id === job.id);
  const score = match?.match_percentage || 0;
  const sc = score > 70 ? "var(--accent-600)" : score > 40 ? "var(--warning-500)" : "var(--danger-500)";
  const isIndia = job.source_region === "India" || job.location?.toLowerCase().includes("india");

  useEffect(() => {
    if (resumeData?.id) {
      setLoading(true);
      apiClient(`/matches/?resume_id=${resumeData.id}&job_id=${job.id}`, { method: "POST" })
        .then(d => setMatch(d))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [job.id, resumeData?.id]);

  const handleApply = async () => {
    if (!job.apply_url) return;
    setApplying(true);
    try {
      await apiClient(`/applications/apply?resume_id=${resumeData.id}&job_id=${job.id}`, { method: "POST" });
      fetchApplications();
    } catch (e) {
      console.error("Apply tracking failed", e);
    } finally {
      setApplying(false);
      window.open(job.apply_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="flex-between" style={{ alignItems: "flex-start" }}>
        <div className="flex" style={{ gap: "1rem", alignItems: "center", flex: 1 }}>
          {job.company_logo && (
            <img
              src={job.company_logo}
              alt={job.company}
              style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "contain", background: "#fff", border: "1px solid var(--border-light)", padding: "2px" }}
              onError={e => { e.target.style.display = "none"; }}
            />
          )}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.15rem" }}>{job.title}</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{job.company} &bull; {job.location}</p>
          </div>
        </div>
        <div className="text-center" style={{ flexShrink: 0 }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: sc }}>{loading ? "-" : `${Math.round(score)}%`}</div>
          <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Match</div>
        </div>
      </div>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{job.excerpt || job.description?.substring(0, 160) + "..."}</p>
      <div className="flex-between" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="flex" style={{ gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {isApplied && <span className="badge badge-success"><CheckCircle size={12} /> Applied</span>}
          {job.source && <span className="badge badge-muted">{job.source}</span>}
          {isIndia && <span className="badge badge-info"><MapPin size={10} /> India</span>}
          {job.job_type && <span className="badge badge-muted">{job.job_type}</span>}
          {job.salary && <span style={{ fontSize: "0.85rem", color: "var(--accent-600)", fontWeight: 700 }}>{job.salary}</span>}
        </div>
        <div className="flex" style={{ gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={onAssist}><Sparkles size={14} /> Assist</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleApply}
            disabled={isApplied || applying || !job.apply_url}
          >
            <ExternalLink size={14} /> {isApplied ? "Applied" : (applying ? "Opening..." : "Apply")}
          </button>
        </div>
      </div>
    </div>
  );
}
