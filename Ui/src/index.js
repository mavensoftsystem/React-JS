
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';

import ProjectCreate from '../src/projectcreation/Projectcreation';
import TaskCreate from '../src/TaskCreate/TaskCreate';

import CreateEmployee from './CreateEmployee/CreateEmployee';

import TimeSheetGrid from './TimeSheet/TimeSheetGrid';
import EmployeTaskView from './EmployeTaskView/EmployeTaskView';

import EmployeeHeader from './header/EmployeeHeader';
import HRheader from './header/HRheader';
import Forgotpassword from './forgotpassword/Forgotpassword'
import TaskAssign from './TaskAssign/TaskAssign';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Changepassword from './Changepassword/Changepassword';
import ProjectsReport from './ProjectsReport/Projectreport'

import Employeereport from './EmployeesReport/Employeereport'

import Login from './login/Login'
import EditProfile from './EditProfile/EditProfile';

const root = ReactDOM.createRoot(document.getElementById('root'));

 
var nn = localStorage.getItem('UserRole');

 if(localStorage['UserRole']==="Employee"){
   
  root.render(
    <React.StrictMode>
  
    { <Router>
      <EmployeeHeader/>
      
    
           <div className="App">
           <Routes>
           
              <Route exact path ='/mytasks' element={<EmployeTaskView/>}> </Route>
              <Route exact path='/timesheet' element={< TimeSheetGrid />}></Route>  
           
              
              <Route exact path ='/Logout' element= {<Login />}> </Route>
               <Route exact path="/changepassword" element= {<Changepassword />}> </Route> 
              
               <Route exact path="/editprofile" element={<EditProfile/>}></Route>
             </Routes>

            </div>
              
          
    </Router>
}
</React.StrictMode>
   );
   
}


else if(localStorage['UserRole']==='Manager'){
  
  root.render(
    <React.StrictMode>
  
    { <Router>
      <HRheader/>
      
    
           <div className="App">
           <Routes>

              <Route exact path ='/CreateEmployee' element={<CreateEmployee/>}> </Route>
              <Route exact path='/CreateProject' element={< ProjectCreate />}></Route>
              <Route exact path='/CreateTask' element={< TaskCreate />}></Route>
              <Route exact path='/tasks' element={< TaskCreate />}></Route>
              <Route exact path ='/Logout' element= {<Login />}> </Route>
              <Route exact path="/changepassword" element= {<Changepassword />}> </Route>  
              <Route exact path ='/taskassign' element= {<TaskAssign />}> </Route>
              <Route exact path ='/projectsreport' element= {<ProjectsReport />}> </Route>
              <Route exact path ='/employeesreport' element= {<Employeereport />}> </Route>
              <Route exact path="/editprofile" element={<EditProfile/>}></Route>
             </Routes>

            </div>
              
          
    </Router>
}
</React.StrictMode>
   );
   
}
else if(nn == 'Rahul'){
  localStorage.removeItem('UserRole')
  root.render(
    <React.StrictMode>
  
    { <Router>
    
           <Routes>

           <Route exact path ='/Forgotpassword' element= {<Forgotpassword />}> </Route>
             </Routes>   
    </Router>
}
</React.StrictMode>
   );
}
else
{ 
   root.render(
    <React.StrictMode>
  <Login />
    { <Router>
    
      <Routes>
        <Route exact path ='/Login' element= {<Login />}> </Route>
    
      </Routes>
    </Router>
    
}


</React.StrictMode>
   );
   
}



reportWebVitals();



