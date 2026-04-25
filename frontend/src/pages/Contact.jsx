import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";

export default function Contact(){
  const [sent,setSent]=useState(false);
  const h=(e)=>{e.preventDefault();setSent(true);};
  return <div className="animate-fade-in">
    <section style={{padding:"4rem 0",background:"linear-gradient(180deg,var(--primary-50) 0%,#fff 100%)"}}>
      <div className="container text-center" style={{maxWidth:"720px"}}>
        <h1 style={{fontSize:"2.5rem",marginBottom:"1rem"}}>Contact Us</h1>
        <p style={{fontSize:"1.1rem",color:"var(--text-muted)",lineHeight:1.7}}>Have questions? We would love to hear from you.</p>
      </div>
    </section>
    <section style={{padding:"2rem 0 5rem",background:"#fff"}}>
      <div className="container" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"3rem",maxWidth:"900px"}}>
        <div className="flex-col" style={{gap:"1.5rem"}}>
          {[{icon:<Mail size={20}/>,t:"Email",v:"hello@smarthire.ai"},{icon:<Phone size={20}/>,t:"Phone",v:"+1 (555) 123-4567"},{icon:<MapPin size={20}/>,t:"Office",v:"123 AI Drive, San Francisco, CA"}].map(i=>(
            <div key={i.t} className="card flex" style={{padding:"1.25rem",gap:"1rem",alignItems:"center"}}>
              <div style={{width:"40px",height:"40px",background:"var(--accent-50)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--accent-600)"}}>{i.icon}</div>
              <div><p style={{fontSize:"0.8rem",color:"var(--text-muted)",fontWeight:600,textTransform:"uppercase"}}>{i.t}</p><p style={{fontWeight:600}}>{i.v}</p></div>
            </div>
          ))}
        </div>
        <div className="card-elevated" style={{padding:"2rem"}}>
          {sent?(<div className="text-center flex-col flex-center" style={{gap:"1rem",minHeight:"280px"}}><CheckCircle size={48} style={{color:"var(--accent-600)"}}/><h3 style={{fontSize:"1.25rem"}}>Message Sent!</h3><p style={{color:"var(--text-muted)"}}>We will get back to you within 24 hours.</p></div>)
          :(<form onSubmit={h} className="flex-col" style={{gap:"1rem"}}>
            <div><label style={{fontSize:"0.85rem",fontWeight:600}}>Name</label><input type="text" className="input" required placeholder="Your name"/></div>
            <div><label style={{fontSize:"0.85rem",fontWeight:600}}>Email</label><input type="email" className="input" required placeholder="you@company.com"/></div>
            <div><label style={{fontSize:"0.85rem",fontWeight:600}}>Message</label><textarea className="input" rows={4} required placeholder="How can we help?"/></div>
            <button type="submit" className="btn btn-primary btn-lg"><Send size={16}/> Send Message</button>
          </form>)}
        </div>
      </div>
    </section>
  </div>;
}
