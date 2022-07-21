
import '../login/login.css'
import React from 'react'

import base_url from '../Config';

import ui_url from '../Redirect';
class login extends React.Component {

  constructor(props) {
    super(props);
    const initialState = {
      Email: '',
      Password: '',
      ispasswordShown: false


    }
    this.state = initialState;

  }
  togglePasswordVisibily = () => {
    const { ispasswordShown } = this.state;
    this.setState({ ispasswordShown: !ispasswordShown })
  }
  componentDidMount() {


    if (localStorage['UserRole'] !== '') {
      localStorage['UserRole'] = '';
      window.location.reload();
    }


  }

  handleChange = async (event) => {
    await this.setState({ [event.target.name]: event.target.value });

  }

  //checkuser valid or not
  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.state.Email === '') {
      alert("Enter Email Address");
    }
    else if (this.state.Password === '') {
      alert("Enter Password");
    }
    else {

      const response = await fetch(base_url + "Signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          Email_ID: this.state.Email,
          Password: this.state.Password,


        }),
      });
      if (response.status === 200) {
        const Logindata = await response.json();

        if (Logindata == '') {
          alert("Invalid Credentials")
        }
        else {
          if (this.state.Email == Logindata[0].Email_ID && this.state.Password == Logindata[0].Password) {


            if (Logindata.length == 0) {
              alert("Invalid Credentials");
              document.getElementById('inputEmail').focus();
              document.getElementById('inputEmail').value = "";
              document.getElementById('inputPassword').value = "";
            }
            else {
              localStorage['emailid'] = Logindata[0].Email_ID;
              localStorage['paswd'] = Logindata[0].Password;
              if (Logindata.length > 0) {
                localStorage['E_ID'] = Logindata[0].E_ID;
                console.log(Logindata[0].Role_ID);
                if (Logindata[0].Role_ID === 2) {

                  localStorage['UserRole'] = "Employee";

                  window.location.replace(ui_url + "mytasks");
                }
                else if (Logindata[0].Role_ID === 1) {

                  localStorage['UserRole'] = "Manager";

                  window.location.replace(ui_url + "CreateEmployee");
                }
                else if (Logindata[0].Role_ID === 3) {
                  alert('User Role is Admin');
                  localStorage['UserRole'] = "Admin";
                }
              }
              else {
                alert("Invalid Credentials");
                localStorage['UserRole'] = "";
              }
            }
          }

          else {
            alert("Invalid Credentials")
          }
        }
      }
      else if (response.status === 400) {
        alert("Error");
        localStorage['UserRole'] = "";
      }
    }
  }

  handleForgotSubmit = async (event) => {


    localStorage.setItem('UserRole', 'Rahul');
    var nn = localStorage.getItem('UserRole');
    if (nn == 'Rahul') {

      window.location.replace(ui_url + "Forgotpassword");
      //  localStorage.removeItem('UserRole')
    }
    else {

    }

  }

  render() {
    const { ispasswordShown } = this.state
    return (

      <div id="LoginForm">
        <div class="container">
          <div class="login-form">
            <div class="main-div well">
              <div class="panel">
                <h1 style={{ color: "#044981" }}>Time Tracker</h1>

                <p>Please Enter Your Email And Password</p>
              </div>
              <form id="Login">

                <div class="form-group">
                  <input type="email" name='Email' class="form-control" id="inputEmail" placeholder="Email Address" onChange={this.handleChange} />

                </div>

                <div class="input-group">
                  <input type={(ispasswordShown) ? 'text' : 'password'} name='Password' class="form-control" id="inputPassword" placeholder="Password" maxLength="10" onChange={this.handleChange} ></input>
                  <span class="input-group-btn">
                    <button class="btn btn-default pass_visib" type="button" onClick={this.togglePasswordVisibily}><i class="glyphicon glyphicon-eye-open"></i></button>
                  </span>
                </div>

                <div class="forgot col-md-2" >
                  <u><h4 id='mouse' onClick={this.handleForgotSubmit} onMouseOver >Forgot Password?</h4> </u>
                </div>
                <div>

                  <button type="submit" class="btn btn-primary" onClick={this.handleSubmit}>Login</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}


export default login;