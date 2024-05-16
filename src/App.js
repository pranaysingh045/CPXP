import logo from './logo.svg';
import {BrowserRouter as Router,Routes ,Route } from 'react-router-dom';
import './App.css';
import Login from './AuthFolder/Login';
import Test from './AuthFolder/test';
import Signup from './AuthFolder/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/CSS/Login.css'
import EmployeerDash from './Dashboard/EmployeerDash';
import Index from './LayoutPage/Index';
import PostJob from './Pages/PostJob';
import Profile from './Pages/Profile';
import JobList from './Pages/JobList';
import Settings from './Pages/Settings';
import Layout from './CandidatePage/LayoutPage/Layout';
//candidate
// import CandidateLogin from './CandidatePage/CandidateLogin';
//import CandidateReg from './CandidatePage/CandidateReg';
//import CandDashboard from './CandidatePage/Pages/CandDashboard';
import Appliedjoblist from './CandidatePage/Pages/Appliedjoblist';
import Documents from './CandidatePage/Pages/Documents';
import CandidateProfile from './CandidatePage/Pages/CandidateProfile';
import CandidateSetting from './CandidatePage/Pages/CandidateSetting';
import { Suspense, lazy } from 'react';
import SpinnerLod from './LayoutPage/SpinnerLod';
import CandidateByrequ from './Pages/CandidateByrequ';
const CandidateLogin=lazy(()=>import("./CandidatePage/CandidateLogin"))
const CandidateReg=lazy(()=>import("./CandidatePage/CandidateReg"))
const CandDashboard=lazy(()=>import("./CandidatePage/Pages/CandDashboard"))





function App() {
  return (
    <>
    <Router>
    <Suspense fallback={<SpinnerLod/>}>
      <Routes>
           <Route element={<Login/>} path='/'></Route>
            <Route element={<Signup />} path='/signup'></Route>

          <Route element={<Index/>}>
            
            <Route element={<EmployeerDash/>} path='/Dashboard'></Route>
            <Route element={<PostJob/>} path='/PostJob'></Route>
            <Route element={<Profile/>} path='/Profile'></Route>
            <Route element={<JobList/>} path='/joblist'></Route>
            <Route element={<Settings/>} path='/setting'></Route>
            <Route element={<CandidateByrequ/>} path='/myrequestion/:id'></Route>
            
            

        </Route>
        {/* candidate portal */}
        <Route element={<Layout/>}>
          <Route element={<CandDashboard/>} path='/candidate/dashboard'></Route>
          <Route element={<Appliedjoblist/> } path='/candidate/MyJoblist'></Route>
          <Route element={<Documents/>} path='/candidate/documents'></Route>
          <Route element={<CandidateProfile/>} path='/candidate/profile'></Route>
          <Route element={<CandidateSetting/>} path='/candidate/setting'></Route>

        </Route>
        
        <Route element={<CandidateLogin/>} path='/candidate/login' ></Route>
        <Route element={<CandidateReg/>} path='/candidate/registration'></Route>

        
        
      </Routes>
      
        
        
        
        </Suspense>
        

     
    </Router>
    
    
    
    
    </>
  );
}

export default App;
