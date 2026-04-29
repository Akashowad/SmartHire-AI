import React from "react";
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
          </div>
        ))}
      </div>
    </div>
  );
}
