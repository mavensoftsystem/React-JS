import React, { Component } from 'react';
import '../login/login.css';
import ui_url from '../Redirect';
import base_url from '../Config';
const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
class Forgotpassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: ''
    }

  }
  handleLoginSubmit = async (event) => {

    window.location.replace(ui_url + "");
  }
  handleChange = (event) => {

    this.setState({ [event.target.name]: event.target.value });
  }

  checkEmailPassword = async () => {

    const response = await fetch(base_url + "CheckEmailPassword", {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
      }),

    });
    if (response.status === 200) {

      const data = await response.json();
      if (this.state.email == '') {
        alert("Enter Email Address");
      }
      else if (!emailRegex.test(document.getElementById("txt_email").value)) {
        alert("Please Enter Valid Email Address");

      }
      else if (data == '') {
        alert("This Email Address Was Not Registered")
      }
      else {
        if (this.state.email == data[0].Email_ID) {
          alert("Password Sent To Your Registered Email Address");
          if (this.state.email == '') {
            alert("Enter Email Address");
          }
          else {

            const response = await fetch(base_url + "Forgotpassword", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: this.state.email
              }),
            });
            window.location.replace(ui_url + "");


          }

        }
      }
    }
  }

  submitChange = async (event) => {

    event.preventDefault();
    this.checkEmailPassword();

  }

  render() {

    return (
      <div id="LoginForm">
        <div class="container">
          <div class="forgot-form">
            <div class="main-div well">
              <h3> Find Your Account</h3>
              <p>  Please Enter Your Email Address. </p>
              <div class="panel">
              </div>
              <form id="Login">

                <div class="form-group">
                  <input type="email" name='email' class="form-control" id="txt_email" placeholder=" Email Address" onChange={this.handleChange} value={this.state.email} required />

                </div>
                <div class="forgot col-md-6">
                  < button type="submit" name="submit" class="btn btn-primary" value="Submit" id="bt-for" onClick={this.submitChange}>Submit</button>
                  &nbsp;
                  <input type="button" onClick={this.handleLoginSubmit} class="btn btn-danger btn-r-10" id="CancelTak" value="Cancel" />

                </div>
              </form>

            </div>

          </div>
        </div>
      </div>

    )
  }
}

export default Forgotpassword