import React, { Component } from 'react'
import '../Changepassword/Changepassword.css';
import base_url from '../Config';
export class Changepassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            currentpassword: '',
            newpassword: '',
            newpassword2: '',
            ispasswordShown1: false,
            ispasswordShown2: false,
            ispasswordShown3: false

        }
        //this.password = localStorage['paswd'];
        this.emailid = localStorage['emailid'];
        this.validate_Form = this.validate_Form.bind(this);
        this.submitChange = this.submitChange.bind(this);

    }

    togglePasswordVisibily1 = () => {
        const { ispasswordShown1 } = this.state;
        this.setState({ ispasswordShown1: !ispasswordShown1 });


    }
    togglePasswordVisibily2 = () => {
        const { ispasswordShown2 } = this.state;
        this.setState({ ispasswordShown2: !ispasswordShown2 });
    }

    togglePasswordVisibily3 = () => {
        const { ispasswordShown3 } = this.state;
        this.setState({ ispasswordShown3: !ispasswordShown3 });
    }
    handleChange = (event) => {
        console.log(event);
        this.setState({ [event.target.name]: event.target.value });

    }
    validate_Form() {
         

        var Email = document.getElementById('txt_email');
        var CPWD = document.getElementById('txt_crntpswd');
        var NPWD = document.getElementById('txt_newpswd');
        var CNPWD = document.getElementById('txt_newpswd2');
        if (CPWD.value != localStorage['paswd']) {

            alert('Please Enter Valid Current Password');
            CPWD.focus();
        }
        else if (CPWD.value === '') {
            alert('Enter Current Password');
            CPWD.focus();
        }

        else if (NPWD.value === '') {
            alert('Please Enter New  Password');
            NPWD.focus();
        }
        else if (NPWD.value.length < 10) {
            alert('Password Length Must Be Atleast 10 Characters');
            NPWD.focus();
        }
        else if (NPWD.value.length > 15) {
            alert('Password Length Must Not Exceed 15 Characters');
            NPWD.focus();
        }
        else if (CNPWD.value === '') {
            alert('Please Enter Confirm Password');
            CNPWD.focus();
        } else if (NPWD.value == CPWD.value) {
            alert('Current Password And New Password Cannot Be Same');

        }
        else if (CNPWD.value != NPWD.value) {
            alert('New Password And Confirm Password Must Be Same');

        }

        else {
            localStorage['Email'] = Email.value;
            localStorage['CPWD'] = CPWD.value;
            localStorage['NPWD'] = NPWD.value;
            localStorage['CNPWD'] = CNPWD.value;
            localStorage['ChangePWDValid'] = 'True';
        }


    }
    submitChange = async (event) => {
        event.preventDefault();
        var Emailid = localStorage['emailid'];
        localStorage['ChangePWDValid'] = '';
        this.validate_Form();
        if (localStorage['ChangePWDValid'] === 'True') {
            var answer = window.confirm("Do You Want To Change Password?");
            if (answer) {

                const response = await fetch(base_url + "GetChangepassword", {
                    method: 'put',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        email: Emailid,
                        currentpassword: localStorage['CPWD'],
                        newpassword: localStorage['NPWD'],
                        newpassword2: localStorage['CNPWD'],
                    }),
                });
                if (response.status === 200) {
                    const body = await response.text();
                    alert("Password Changed Successfully");


                    document.getElementById('txt_crntpswd').value = '';
                    document.getElementById('txt_newpswd').value = '';
                    document.getElementById('txt_newpswd2').value = '';
                    localStorage['paswd'] = localStorage['NPWD'];

                }

            }
            else {

                alert('Password Not Changed')
            }
        } else {
            event.preventDefault();
        }
    }

    render() {
        const { ispasswordShown1 } = this.state
        const { ispasswordShown2 } = this.state
        const { ispasswordShown3 } = this.state
        return (



            <div id="LoginForm">
                <div class="container">
                    <div class="login-form">
                        <div class="main-div well">
                            <div class="panel">
                                <h3> Change Password</h3>

                            </div>
                            < form id="taskas" onSubmit={this.submitChange}>

                                <div class="form-group">


                                    <input name="email" id="txt_email" placeholder="Email Id" value={localStorage["emailid"]} class="form-control" type="email" readOnly={true} />
                                </div>
                                <div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <input name="currentpassword" id="txt_crntpswd" placeholder="Current Password" onChange={this.handleChange} class="form-control" type={(ispasswordShown1) ? 'text' : 'password'} maxLength="10" />
                                            <span class="input-group-btn">
                                                <button class="btn btn-default pass_visib" type="button" onClick={this.togglePasswordVisibily1}><i class="glyphicon glyphicon-eye-open"></i></button>
                                            </span>
                                        </div></div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">

                                        <input name="newpassword" id="txt_newpswd" placeholder="New Password" onChange={this.handleChange} class="form-control" type={(ispasswordShown2) ? 'text' : 'password'} maxLength="10" />
                                        <span class="input-group-btn">
                                            <button class="btn btn-default pass_visib" type="button" onClick={this.togglePasswordVisibily2}><i class="glyphicon glyphicon-eye-open"></i></button>
                                        </span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">

                                        <input name="newpassword2" id="txt_newpswd2" placeholder="Confirm Password " onChange={this.handleChange} class="form-control" type={(ispasswordShown3) ? 'text' : 'password'} maxLength="10" />
                                        <span class="input-group-btn">
                                            <button class="btn btn-default pass_visib" type="button" onClick={this.togglePasswordVisibily3}><i class="glyphicon glyphicon-eye-open"></i></button>
                                        </span>
                                    </div>
                                </div>
                                <div class="forgot">

                                    <input type="submit" name="submit" className="btn btn-success" value="Submit" id="submit_chngpswd" onSubmit={this.submitChange} />
                                </div>
                            </form>


                        </div>
                    </div>
                </div>
            </div>


        );
    }
}


export default Changepassword

