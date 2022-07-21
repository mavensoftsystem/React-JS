import '../header/header.css';
import {Link} from 'react-router-dom';
import React from 'react';

class  EmployeeHeader extends React.Component {
   
    render(){ 
            return (
       
         
                <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                        <Link class="navbar-brand" to="/mytasks">
                                <img src="/logo.png" alt="LOGO" ></img>
                            </Link>
                    </div>
                    <ul class="nav navbar-right top-nav">         
                        <li class="dropdown">
                            <Link to="/mytasks" class="dropdown-toggle" data-toggle="dropdown">Employee User <b class="fa fa-angle-down"></b></Link>
                            <ul class="dropdown-menu">
                                <li><Link to="/editprofile"><i class="glyphicon glyphicon-pencil"></i> Edit Profile</Link></li>
                                <li><Link to="/changepassword"><i class="fa fa-fw fa-cog"></i> Change Password</Link></li>
                                <li class="divider"></li>
                                <li><Link to="/Logout"><i class="fa fa-fw fa-power-off"></i> Logout</Link></li>
                            </ul>
                        </li>
                    </ul>
                    <div class="collapse navbar-collapse navbar-ex1-collapse">
                        <ul class="nav navbar-nav side-nav">
                            <li>
                                <Link to="/mytasks"><i class="glyphicon glyphicon-tasks"></i> Tasks</Link>
                            
                            </li>
                            <li>
                                <Link to="/timesheet"><i class="glyphicon glyphicon-time"></i> TimeSheet</Link>
                            
                            </li>
                           
                           
                          
                        
                            
                        </ul>
                    </div>
                </nav>
    );
        
    }
}

export default EmployeeHeader;
