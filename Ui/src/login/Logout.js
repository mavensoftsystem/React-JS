import '../login/login.css'
import React ,{ useState, useEffect ,Redirect }  from 'react'
import Login from './login/login';
import {Link} from 'react-router-dom';
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Forgotpassword from '../forgotpassword/Forgotpassword';
class LogOut extends React.Component {

    constructor(props) {
        super(props);
        const initialState = {
          Email: '',
          Password :''
           

        }
        this.state = initialState;
       
    }
    componentDidMount() {
         
        if(localStorage['UserRole'] !==''){
            localStorage.removeItem['UserRole'];
            
            <Redirect to='/Login' />
            //  window.location.reload();
           
            window.onbeforeunload = function (e) {
                window.onunload = function () {
                        window.localStorage.isMySessionActive = "false";
                       
                }
                return undefined;
            };

          }
          else{

          }
    }

  
    render() {

      return (
        <div id="LoginForm">
        <div class="container">
        <div class="login-form">
        <div class="main-div well">
            <div class="panel">
           <h2> Login</h2>
           <p>Please enter your email and password</p>
           </div>
            <form id="Login">
        
                <div class="form-group">
        
        
                    <input type="email" name='Email' class="form-control" id="inputEmail" placeholder="Email Address" onChange={this.handleChange}/>
        
                </div>
        
                <div class="form-group">
        
                    <input type="password" name='Password' class="form-control" id="inputPassword" placeholder="Password" onChange={this.handleChange}/>
        
                </div>
                <div class="forgot">
               
        </div>
                <button type="submit" class="btn btn-primary" onClick={this.handleSubmit}>Login</button>
        
            </form>
            </div>
       
        </div>
        </div>
        </div>
      );
    }
}


export default LogOut;

