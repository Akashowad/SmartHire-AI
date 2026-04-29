# Write JobCard.jsx with proper JSX
jobcard_content = r"""import React, { useState, useEffect } from "react";
import { apiClient } from "../api";
import { useApp } from "../context/AppContext";
import { useBookmarks } from "../hooks/useBookmarks";
import { toast } from "../hooks/useToast";
import { Bookmark, BookmarkCheck, ExternalLink, Sparkles, Calendar } from "lucide-react";

export default function JobCard({ job, onAssist }) {
  const { resumeData, fetchApplications, applications } = useApp();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [matchScore, setMatchScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isApplied = applications.some(app => app.job_id === job.id);
  const bookmarked = isBookmarked(job.id);

  useEffect(() => {
    if (!resumeData?.id) return;
    setIsLoading(true);
    apiClient("/matches/?resume_id=" + resumeData.id + "&job_id=" + job.id, { method: "POST" })
      .then(data => setMatchScore(data?.match_percentage || 0))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [job.id, resumeData?.id]);

  const handleBookmark = () => {
    toggleBookmark(job);
    toast({ title: bookmarked ? "Removed" : "Saved", message: bookmarked ? "Job removed" : "Job saved", type: bookmarked ? "info" : "success", duration: 2000 });
  };

  const handleApply = async () => {
    if (isApplied) return;
    try {
      await apiClient("/applications/apply?resume_id=" + resumeData.id + "&job_id=" + job.id, { method: "POST" });
      fetchApplications();
      toast({ title: "Applied!", message: "Opening application page", type: "success", duration: 3000 });
    } catch (err) { console.error(err); }
  };

  const scoreColor = matchScore > 70 ? "var(--success)" : matchScore > 40 ? "var(--warning)" : "var(--danger)";
  const timeAgo = job.publication_date ? (() => {
    const days = Math.floor((Date.now() - new Date(job.publication_date).getTime()) / 86400000);
    if (days < 1) return "Today"; if (days === 1) return "Yesterday";
    if (days < 7) return days + "d ago"; if (days < 30) return Math.floor(days / 7) + "w ago";
    return Math.floor(days / 30) + "mo ago";
  })() : null;

  const loc = job.location || "";
  const excerpt = job.excerpt || (job.description ? job.description.substring(0, 150) + "..." : "");

  return (
    <div className="glass-panel" style={{ padding: "1.25rem", gap: "0.875rem" }}>
      <button onClick={handleBookmark} className="btn btn-ghost" style={{ float: "right", color: bookmarked ? "var(--accent-light)" : "var(--text-muted)" }}>
        {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      </button>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ display: "flex", gap: "0.875rem", flex: 1 }}>
          {job.company_logo && <img src={job.company_logo} alt={job.company} loading="lazy" style={{ width: "42px", height: "42px", borderRadius: "10px", objectFit: "contain", background: "white", padding: "3px" }} onError={(e) => { e.target.style.display = "none"; }} />}
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{job.title}</h3>
            <p className="text-secondary" style={{ fontSize: "0.8rem" }}>{job.company} &bull; {loc}</p>
          </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: scoreColor }}>{isLoading ? "..." : matchScore + "%"}</div>
          <div style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>Match</div>
      </div>
      <p className="text-secondary" style={{ fontSize: "0.85rem", lineHeight: 1.6 }}>{excerpt}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          {job.source_region === "India" && <span className="badge badge-accent">India</span>}
          <span className="badge badge-muted">{job.source}</span>
          {job.job_type && <span className="badge badge-muted">{job.job_type}</span>}
          {job.salary && <span style={{ fontSize: "0.8rem", color: "var(--success)", fontWeight: 700 }}>{job.salary}</span>}
          {timeAgo && <span style={{ display: "flex", gap: "0.25rem", alignItems: "center", fontSize: "0.7rem", color: "var(--text-muted)" }}><Calendar size={11} /> {timeAgo}</span>}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button className="btn btn-secondary btn-sm" onClick={onAssist}><Sparkles size={13} /> Assist</button>
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className={"btn btn-sm " + (isApplied ? "btn-secondary" : "btn-primary")} style={{ textDecoration: "none" }} onClick={handleApply}>
            <ExternalLink size={13} /> {isApplied ? "Applied" : "Apply"}
          </a>
        </div>
    </div>
  );
}
"""

bookmarks_content = r"""import React from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../hooks/useBookmarks";
import { BookmarkX, ArrowLeft, ExternalLink } from "lucide-react";

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <div className="animate-fade-in container" style={{ minHeight: "70vh", paddingTop: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Bookmarked Jobs</h1>
        <p className="text-secondary mb-4">0 saved opportunities</p>
        <div className="glass-panel text-center" style={{ padding: "4rem" }}>
          <span style={{ fontSize: "3rem" }}>🔖</span>
          <h3 className="mt-2">No bookmarks yet</h3>
          <p className="text-secondary">Save jobs from the dashboard to view them here.</p>
          <Link to="/dashboard" className="btn btn-primary mt-2">Browse Jobs</Link>
        </div>
    );
  }

  return (
    <div className="animate-fade-in container" style={{ minHeight: "70vh", paddingTop: "2rem" }}>
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Bookmarked Jobs</h1>
          <p className="text-secondary">{bookmarks.length} saved</p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
      <div className="flex-col gap-2">
        {bookmarks.map((job) => (
          <div key={job.id} className="glass-panel" style={{ padding: "1.25rem" }}>
            <div className="flex-between" style={{ alignItems: "flex-start", gap: "1rem" }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{job.title}</h3>
                <p className="text-secondary" style={{ fontSize: "0.85rem" }}>{job.company} &bull; {job.location}</p>
                <p className="text-secondary mt-1" style={{ fontSize: "0.8rem" }}>{job.excerpt}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="badge badge-muted">{job.source}</span>
                  {job.job_type && <span className="badge badge-muted">{job.job_type}</span>}
                  {job.salary && <span className="badge badge-success">{job.salary}</span>}
                </div>
              <div className="flex-col gap-1">
                <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  <ExternalLink size={14} /> Apply
                </a>
                <button className="btn btn-ghost btn-sm" onClick={() => removeBookmark(job.id)} style={{ color: "var(--danger)" }}>
                  <BookmarkX size={14} /> Remove
                </button>
              </div>
          </div>
        ))}
      </div>
  );
}
"""

with open(r"f:/SmartHire AI/frontend/src/components/JobCard.jsx", "w", encoding="utf-8") as f:
    f.write(jobcard_content)

with open(r"f:/SmartHire AI/frontend/src/pages/Bookmarks.jsx", "w", encoding="utf-8") as f:
    f.write(bookmarks_content)

print("Files written successfully")
