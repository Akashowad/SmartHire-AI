import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Globe, MessageSquare, FileText, CheckCircle, Star, Play, Users, Clock, TrendingUp } from "lucide-react";

export default function Home(){
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{padding: "6rem 0 5rem", position: "relative", overflow: "hidden"}}>
        {/* Background glow */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="container" style={{position: "relative", zIndex: 1}}>
          <div className="text-center" style={{maxWidth: "800px", margin: "0 auto"}}>
            <div className="badge badge-accent mb-4" style={{fontSize: "0.8rem", padding: "0.5rem 1rem"}}>
              <Zap size={12} /> Now with AI-Powered Matching
            </div>
            <h1 style={{fontSize: "clamp(2.8rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em"}}>
              Hire smarter.{" "}
              <span style={{color: "var(--primary-green)"}}>Scale faster.</span>
            </h1>
            <p style={{fontSize: "1.2rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "2.5rem", maxWidth: "600px", margin: "0 auto 2.5rem"}}>
              Enterprise AI recruitment platform that matches top talent with your open roles — reducing time-to-hire by up to 70%.
            </p>
            <div className="flex-center flex-wrap gap-3">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/features" className="btn btn-secondary btn-lg">
                See How It Works
              </Link>
            </div>
            <div className="flex-center flex-wrap gap-4 mt-6">
              {["No credit card required", "14-day free trial", "Cancel anytime"].map(t => (
                <span key={t} className="flex" style={{gap: "0.4rem", alignItems: "center", fontSize: "0.85rem", color: "var(--text-muted)"}}>
                  <CheckCircle size={14} style={{color: "var(--success)"}} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{padding: "2rem 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)"}}>
        <div className="container">
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "2rem", textAlign: "center"}}>
            {[
              {v: "70%", l: "Faster Time-to-Hire"},
              {v: "3x", l: "More Qualified Candidates"},
              {v: "50+", l: "Enterprise Clients"},
              {v: "99.9%", l: "Uptime SLA"},
            ].map(s => (
              <div key={s.l}>
                <p style={{fontSize: "2rem", fontWeight: 800, background: "var(--accent-gradient)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>{s.v}</p>
                <p style={{fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem"}}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{padding: "5rem 0"}}>
        <div className="container">
          <div className="text-center mb-5" style={{maxWidth: "600px", margin: "0 auto"}}>
            <h2 style={{fontSize: "2.25rem", marginBottom: "0.75rem", fontWeight: 800}}>Everything your talent team needs</h2>
            <p style={{color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.6}}>
              From sourcing to offer, automate the repetitive work so recruiters focus on relationships.
            </p>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem"}}>
            {[
              {icon: <Zap size={22} />, title: "Smart Matching", desc: "Hybrid SBERT + TF-IDF engine delivers precise compatibility scores in milliseconds.", color: "#6366f1"},
              {icon: <FileText size={22} />, title: "Resume Parsing", desc: "Extract skills, education, and experience from PDF and DOCX automatically.", color: "#3b82f6"},
              {icon: <BarChart3 size={22} />, title: "Analytics", desc: "Track match scores, pipelines, hiring velocity, and team performance.", color: "#f59e0b"},
              {icon: <Shield size={22} />, title: "Enterprise Security", desc: "JWT auth, bcrypt hashing, and RBAC built-in for compliance.", color: "#ef4444"},
              {icon: <Globe size={22} />, title: "Global Job Feeds", desc: "Connect to live APIs and aggregate listings from multiple sources.", color: "#8b5cf6"},
              {icon: <MessageSquare size={22} />, title: "AI Apply Assistant", desc: "Generate tailored cover letters, emails, and interview prep with GPT-4.", color: "#ec4899"},
            ].map(f => (
              <div key={f.title} className="glass-panel" style={{padding: "2rem"}}>
                <div style={{width: "48px", height: "48px", background: `${f.color}15`, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem", color: f.color}}>
                  {f.icon}
                </div>
                <h3 style={{fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem"}}>{f.title}</h3>
                <p style={{fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{padding: "5rem 0", background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)"}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 style={{fontSize: "2.25rem", marginBottom: "0.75rem", fontWeight: 800}}>How SmartHire works</h2>
            <p style={{color: "var(--text-secondary)"}}>Four steps to transform your hiring process</p>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem"}}>
            {[
              {n: "01", t: "Upload Resumes", d: "Our AI parses skills and experience in seconds."},
              {n: "02", t: "Match with Jobs", d: "Engine scores every candidate with detailed breakdowns."},
              {n: "03", t: "Automate Outreach", d: "Generate personalized materials at scale."},
              {n: "04", t: "Track & Optimize", d: "Monitor pipeline and improve hiring continuously."},
            ].map(s => (
              <div key={s.n} className="text-left">
                <span style={{fontSize: "2.5rem", fontWeight: 800, color: "var(--accent-primary)", opacity: 0.3, fontFamily: "var(--font-mono)"}}>{s.n}</span>
                <h3 style={{fontSize: "1.1rem", fontWeight: 700, marginTop: "0.75rem", marginBottom: "0.4rem"}}>{s.t}</h3>
                <p style={{fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{padding: "5rem 0"}}>
        <div className="container">
          <div className="text-center mb-5" style={{maxWidth: "600px", margin: "0 auto"}}>
            <h2 style={{fontSize: "2.25rem", marginBottom: "0.75rem", fontWeight: 800}}>Loved by talent teams</h2>
            <p style={{color: "var(--text-secondary)"}}>See why leading companies trust SmartHire AI.</p>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem"}}>
            {[
              {q: "This tool cut our hiring time in half. The matching engine actually works.", a: "J. Miller", r: "Talent Lead, TechCorp"},
              {q: "Parsing resumes used to take forever. Now it is instant and accurate.", a: "A. Patel", r: "Recruiting Manager, NextGen"},
              {q: "Security requirements were strict and this passed every check we threw at it.", a: "R. Kim", r: "Engineering Director, CloudScale"},
            ].map(t => (
              <div key={t.a} className="glass-panel" style={{padding: "2rem"}}>
                <div style={{marginBottom: "1.25rem"}}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{color: "var(--warning)", fill: "var(--warning)", marginRight: "2px"}} />
                  ))}
                </div>
                <p style={{fontSize: "1rem", lineHeight: 1.7, marginBottom: "1.5rem", color: "var(--text-secondary)", fontStyle: "italic"}}>
                  "{t.q}"
                </p>
                <div className="flex" style={{gap: "0.75rem", alignItems: "center"}}>
                  <div style={{width: "40px", height: "40px", background: "var(--accent-gradient)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: "0.85rem"}}>
                    {t.a.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p style={{fontWeight: 700, fontSize: "0.9rem"}}>{t.a}</p>
                    <p style={{fontSize: "0.8rem", color: "var(--text-muted)"}}>{t.r}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: "5rem 0", position: "relative", overflow: "hidden"}}>
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)",
          borderTop: "1px solid var(--border-subtle)",
        }} />
        <div className="container text-center" style={{position: "relative", zIndex: 1}}>
          <div className="card-elevated" style={{padding: "4rem 3rem", maxWidth: "720px", margin: "0 auto", background: "var(--bg-surface-elevated)", border: "1px solid var(--border-light)"}}>
            <h2 style={{fontSize: "2rem", marginBottom: "0.75rem", fontWeight: 800}}>Ready to transform your hiring?</h2>
            <p style={{color: "var(--text-secondary)", marginBottom: "2rem", fontSize: "1.05rem"}}>
              Join 50+ enterprise teams using SmartHire AI to hire top talent faster than ever.
            </p>
            <div className="flex-center flex-wrap gap-3">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-secondary btn-lg">
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

