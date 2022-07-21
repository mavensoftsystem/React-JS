import '../header/header.css';
import { Link } from 'react-router-dom';
import React from 'react';

class HRheader extends React.Component {

    render() {
        return (


            <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <Link class="navbar-brand" to="/CreateEmployee">
                        <img src="/logo.png" alt="LOGO"></img>
                    </Link>
                </div>
                <ul class="nav navbar-right top-nav">
                    <li class="dropdown">
                        <Link to="/CreateEmployee" class="dropdown-toggle" data-toggle="dropdown">Admin User <b class="fa fa-angle-down"></b></Link>
                        <ul class="dropdown-menu">
                            <li><Link to="/editprofile"><i class="glyphicon glyphicon-edit"></i> Edit Profile</Link></li>
                            <li><Link to="/changepassword"><i class="fa fa-fw fa-cog"></i> Change Password</Link></li>
                            <li class="divider"></li>
                            <li><Link to="/Logout"><i class="fa fa-fw fa-power-off"></i> Logout</Link></li>
                        </ul>
                    </li>
                </ul>
                <div class="collapse navbar-collapse navbar-ex1-collapse">
                    <ul class="nav navbar-nav side-nav">

                        <li>
                            <Link to="/CreateEmployee"><i class="fa fa-fw fa-user-plus"></i>Employees</Link>

                        </li>
                        <li>
                            <Link to="/CreateProject"><i class="glyphicon glyphicon-briefcase"></i>   Projects</Link>

                        </li>
                        <li>
                            <Link to="/createtask"><i class="glyphicon glyphicon-bullhorn"></i> Create Task</Link>

                        </li>
                        <li>
                            <Link to="/taskassign"><i class="glyphicon glyphicon-edit"></i> Assign Task</Link>

                        </li>
                        <li>
                            <Link to="/" data-toggle="collapse" data-target="#submenu-1"><i className="glyphicon glyphicon-save"></i> Reports <i className="fa fa-fw fa-angle-down pull-right"></i></Link>
                            <ul id="submenu-1" className="collapse">
                                <li>
                                    <Link to="/projectsreport"><i class="glyphicon glyphicon-arrow-down"></i>Projects</Link>

                                </li>
                                <li>
                                    <Link to="/employeesreport"><i class="glyphicon glyphicon-arrow-down"></i>Employees</Link>

                                </li>

                            </ul>
                        </li>


                    </ul>
                </div>
            </nav>
        );

    }
}

export default HRheader;
