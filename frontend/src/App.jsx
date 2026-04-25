import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function PrivateRoute({children}){
  const {isAuthenticated,loading}=useAuth();
  if(loading)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="spinner" style={{width:"40px",height:"40px"}}/></div>;
  return isAuthenticated?children:<Navigate to="/login" replace/>;
}

function App(){
  return <AuthProvider>
    <Routes>
      <Route path="/" element={<Layout><Home/></Layout>}/>
      <Route path="/features" element={<Layout><Features/></Layout>}/>
      <Route path="/pricing" element={<Layout><Pricing/></Layout>}/>
      <Route path="/about" element={<Layout><About/></Layout>}/>
      <Route path="/contact" element={<Layout><Contact/></Layout>}/>
      <Route path="/login" element={<Layout><Login/></Layout>}/>
      <Route path="/signup" element={<Layout><Signup/></Layout>}/>
      <Route path="/dashboard" element={<PrivateRoute><AppProvider><Dashboard/></AppProvider></PrivateRoute>}/>
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  </AuthProvider>;
}

export default App;
