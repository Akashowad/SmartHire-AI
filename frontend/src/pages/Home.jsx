import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Globe, MessageSquare, FileText, CheckCircle, Star } from "lucide-react";

export default function Home(){
  return <div className="animate-fade-in">
    <section style={{padding:"5rem 0",background:"linear-gradient(135deg,var(--primary-50) 0%,#f1f5f9 100%)"}}>
      <div className="container flex-between" style={{gap:"3rem",flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:"320px"}}>
          <div className="badge badge-muted mb-3"><Zap size={12}/> Smart Matching</div>
          <h1 style={{fontSize:"clamp(2.5rem,5vw,3.5rem)",fontWeight:800,lineHeight:1.1,marginBottom:"1.25rem"}}>Hire smarter. <span style={{color:"var(--accent-600)"}}>Scale faster.</span></h1>
          <p style={{fontSize:"1.15rem",color:"var(--text-muted)",lineHeight:1.7,marginBottom:"2rem",maxWidth:"520px"}}>Enterprise AI recruitment platform that matches top talent with your open roles — reducing time-to-hire by up to 70%.</p>
          <div className="flex flex-wrap gap-3">
            <Link to="/signup" className="btn btn-primary btn-lg">Start Free Trial <ArrowRight size={16}/></Link>
            <Link to="/features" className="btn btn-secondary btn-lg">See How It Works</Link>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {["No credit card","14-day trial","Cancel anytime"].map(t=><span key={t} className="flex" style={{gap:"0.35rem",alignItems:"center",fontSize:"0.85rem",color:"var(--text-muted)"}}><CheckCircle size={14} style={{color:"var(--accent-600)"}}/>{t}</span>)}
          </div>
        </div>
        <div style={{flex:1,minWidth:"300px"}}>
          <div className="card-elevated" style={{padding:"2rem"}}>
            <div className="flex-between mb-3"><h3 style={{fontSize:"1rem",fontWeight:700}}>AI Match Score</h3><span className="badge badge-success">Live</span></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem",marginBottom:"1rem"}}>
              {[{l:"Match Rate",v:"94%",s:"+12%"},{l:"Time Saved",v:"68h",s:"/recruiter"},{l:"Candidates",v:"2,401",s:"In pipeline"},{l:"Offers",v:"143",s:"This quarter"}].map(x=>(
                <div key={x.l} className="card" style={{padding:"0.75rem"}}>
                  <p style={{fontSize:"0.7rem",color:"var(--text-muted)",textTransform:"uppercase",fontWeight:600}}>{x.l}</p>
                  <p style={{fontSize:"1.25rem",fontWeight:800}}>{x.v}</p>
                  <p style={{fontSize:"0.75rem",color:"var(--accent-600)",fontWeight:500}}>{x.s}</p>
                </div>
              ))}
            </div>
            <div className="card flex" style={{padding:"0.75rem",gap:"0.75rem",alignItems:"center"}}>
              <div style={{width:"32px",height:"32px",background:"var(--accent-50)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center"}}><Zap size={16} style={{color:"var(--accent-600)"}}/></div>
              <div><p style={{fontWeight:600,fontSize:"0.85rem"}}>Senior Frontend Engineer</p><p style={{fontSize:"0.75rem",color:"var(--text-muted)"}}>12 matched • 3 interviews scheduled</p></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style={{padding:"2rem 0",borderBottom:"1px solid var(--border-light)",background:"#fff"}}>
      <div className="container text-center">
        <p style={{fontSize:"0.75rem",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:"1.25rem"}}>Trusted by leading companies</p>
        <div className="flex-center flex-wrap" style={{gap:"2.5rem",opacity:0.5}}>
          {["TechCorp","NextGen","CloudScale","DataFlow","BuildFast","AppWorks"].map(n=><span key={n} style={{fontWeight:800,fontSize:"1.1rem",color:"var(--primary-500)",fontFamily:"var(--font-display)"}}>{n}</span>)}
        </div>
      </div>
    </section>

    <section style={{padding:"4rem 0",background:"#fff"}}>
      <div className="container">
        <div className="text-center mb-5" style={{maxWidth:"600px",margin:"0 auto"}}>
          <h2 style={{fontSize:"2rem",marginBottom:"0.75rem"}}>Everything your talent team needs</h2>
          <p style={{color:"var(--text-muted)",fontSize:"1rem"}}>From sourcing to offer, automate the repetitive work so recruiters focus on relationships.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
          {[{i:<Zap size={22} style={{color:"var(--accent-600)"}}/>,t:"Smart Matching",d:"Hybrid SBERT + TF-IDF engine delivers precise compatibility scores in milliseconds."},{i:<FileText size={22} style={{color:"var(--info-500)"}}/>,t:"Resume Parsing",d:"Extract skills, education, and experience from PDF and DOCX automatically."},{i:<BarChart3 size={22} style={{color:"var(--warning-500)"}}/>,t:"Analytics",d:"Track match scores, pipelines, hiring velocity, and team performance."},{i:<Shield size={22} style={{color:"var(--danger-500)"}}/>,t:"Enterprise Security",d:"JWT auth, bcrypt hashing, and RBAC built-in for compliance."},{i:<Globe size={22} style={{color:"#8b5cf6"}}/>,t:"Global Job Feeds",d:"Connect to live APIs and aggregate listings from multiple sources."},{i:<MessageSquare size={22} style={{color:"#ec4899"}}/>,t:"AI Apply Assistant",d:"Generate tailored cover letters, emails, and interview prep with GPT-4."}].map(f=>(
            <div key={f.t} className="card" style={{padding:"1.75rem"}}>
              <div style={{width:"44px",height:"44px",background:"var(--primary-50)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>{f.i}</div>
              <h3 style={{fontSize:"1.05rem",fontWeight:700,marginBottom:"0.4rem"}}>{f.t}</h3>
              <p style={{fontSize:"0.85rem",color:"var(--text-muted)",lineHeight:1.6}}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{padding:"4rem 0",background:"var(--primary-50)"}}>
      <div className="container text-center">
        <h2 style={{fontSize:"2rem",marginBottom:"2.5rem"}}>How SmartHire works</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"2rem"}}>
          {[{n:"01",t:"Upload Resumes",d:"Our AI parses skills and experience in seconds."},{n:"02",t:"Match with Jobs",d:"Engine scores every candidate with detailed breakdowns."},{n:"03",t:"Automate Outreach",d:"Generate personalized materials at scale."},{n:"04",t:"Track & Optimize",d:"Monitor pipeline and improve hiring continuously."}].map(s=>(
            <div key={s.n} className="text-left">
              <span style={{fontSize:"2.25rem",fontWeight:800,color:"var(--primary-200)",fontFamily:"var(--font-display)"}}>{s.n}</span>
              <h3 style={{fontSize:"1.05rem",fontWeight:700,marginTop:"0.75rem",marginBottom:"0.35rem"}}>{s.t}</h3>
              <p style={{fontSize:"0.85rem",color:"var(--text-muted)",lineHeight:1.6}}>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{padding:"3.5rem 0",background:"var(--primary-900)",color:"#fff"}}>
      <div className="container" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"2rem",textAlign:"center"}}>
        {[{v:"70%",l:"Faster Time-to-Hire"},{v:"3x",l:"More Qualified"},{v:"50+",l:"Enterprise Clients"},{v:"99.9%",l:"Uptime SLA"}].map(s=>(
          <div key={s.l}><p style={{fontSize:"2.25rem",fontWeight:800,fontFamily:"var(--font-display)"}}>{s.v}</p><p style={{fontSize:"0.85rem",color:"var(--primary-400)"}}>{s.l}</p></div>
        ))}
      </div>
    </section>

    <section style={{padding:"4rem 0",background:"#fff"}}>
      <div className="container">
        <div className="text-center mb-5" style={{maxWidth:"600px",margin:"0 auto"}}>
          <h2 style={{fontSize:"2rem",marginBottom:"0.75rem"}}>Loved by talent teams</h2>
          <p style={{color:"var(--text-muted)"}}>See why leading companies trust SmartHire AI.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
          {[{q:"This tool cut our hiring time in half. The matching engine actually works.",a:"J. Miller",r:"Talent Lead, TechCorp"},{q:"Parsing resumes used to take forever. Now it is instant and accurate.",a:"A. Patel",r:"Recruiting Manager, NextGen"},{q:"Security requirements were strict and this passed every check we threw at it.",a:"R. Kim",r:"Engineering Director, CloudScale"}].map(t=>(
            <div key={t.a} className="card-elevated" style={{padding:"1.75rem"}}>
              <div style={{marginBottom:"1rem"}}>{[...Array(5)].map((_,i)=><Star key={i} size={14} style={{color:"var(--warning-500)",fill:"var(--warning-500)"}}/>)}</div>
              <p style={{fontSize:"0.95rem",lineHeight:1.7,marginBottom:"1.25rem",fontStyle:"italic"}}>&quot;{t.q}&quot;</p>
              <div className="flex" style={{gap:"0.75rem",alignItems:"center"}}>
                <div style={{width:"36px",height:"36px",background:"var(--primary-100)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"var(--primary-600)",fontSize:"0.8rem"}}>{t.a.split(" ").map(n=>n[0]).join("")}</div>
                <div><p style={{fontWeight:700,fontSize:"0.85rem"}}>{t.a}</p><p style={{fontSize:"0.75rem",color:"var(--text-muted)"}}>{t.r}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{padding:"4rem 0",background:"var(--primary-50)"}}>
      <div className="container text-center">
        <div className="card-elevated" style={{padding:"3rem 2rem",maxWidth:"720px",margin:"0 auto",background:"var(--primary-900)",border:"none"}}>
          <h2 style={{fontSize:"1.75rem",color:"#fff",marginBottom:"0.75rem"}}>Ready to transform your hiring?</h2>
          <p style={{color:"var(--primary-300)",marginBottom:"1.5rem"}}>Join 50+ enterprise teams using SmartHire AI to hire top talent faster than ever.</p>
          <div className="flex-center flex-wrap gap-3">
            <Link to="/signup" className="btn btn-accent btn-lg">Start Free Trial <ArrowRight size={16}/></Link>
            <Link to="/contact" className="btn btn-ghost btn-lg" style={{color:"#fff",borderColor:"rgba(255,255,255,0.2)"}}>Talk to Sales</Link>
          </div>
        </div>
      </div>
    </section>
  </div>;
}
