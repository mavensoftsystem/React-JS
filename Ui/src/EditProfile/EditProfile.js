import React, { Component } from 'react'
import base_url from '../Config';
import '../EditProfile/EditProfile.css'

class EditProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            EmpId: '',
            firstname: '',
            lastname: '',
            Email: '',
            DOJ: '',
            contactno: '',
           
            uEmp_ID:'',
            uEmail_ID:'',
            uDOJ:'',
        }
   
    }
  
    componentDidMount() {
        this.GetUserProfile();
    }
    NoNumbers = async (event) => {
        
        var charCode = "";
        if (event) {
            charCode = event.keyCode;
        }
        if (charCode !== 32) {
            let value = event.target.value;
            let numbers = value.replace(/[^a-zA-Z\s]/g, "");
            event.target.value = numbers;
        }

    }
    onlyAlphabets = (e, t) => {
        var charCode = '';
        if (window.event) {
            charCode = window.event.keyCode;
        }
        else if (e) {
            charCode = e.which;
        }
        var validator = new RegExp('^([a-zA-Z]+$)');
        var tnamechar = String.fromCharCode(charCode);
        var runner = validator.test(tnamechar);
        var fname = document.getElementById('txt_firstname');
        var lname = document.getElementById('txt_lastname');
        if ((charCode == 32 && fname.value.length == 0) || (charCode == 32 && lname.value.length == 0)) {
            e.preventDefault();
        }
        else if (charCode == 8 || charCode == 20 || charCode == 32 || charCode == 16 || charCode == 17 || charCode == 9 || charCode == 13 || charCode <= 40 && charCode >= 37) {
        }
        else if (96 <= charCode && charCode <= 111) {
            e.preventDefault();
            alert('Only Alphabets are Allowed');
           
        }
        else if (runner) {
        }
        else {
            e.preventDefault();
            alert('Only Alphabets are Allowed');
          
        }
    }
    IsPhoneNumber = (e) => {
        
        var IsPhNum = e.target.value;


        if (!isNaN(IsPhNum) && Math.round(IsPhNum) !== IsPhNum) {
            if (IsPhNum <= 9999999999) {
                IsPhNum = IsPhNum.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                this.setState({ contactno: IsPhNum });
                
            }

        }
        else {
            alert('Please Enter Digits Only');
            document.getElementById("txt_contactno").value = "";
            document.getElementById("txt_contactno").focus();
        }


    }
    GetUserProfile=async() =>{
        const response = await fetch(base_url+"GetProfile", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                E_ID: localStorage['E_ID'],
            }),
        });
        if (response.status === 200) {
            const result = await response.json();
           
            document.getElementById('txt_empid').value = result[0]['Emp_ID'];
            this.setState({uEmp_ID:result[0]['Emp_ID']})
            document.getElementById('txt_firstname').value = result[0]['First_Name'];
            document.getElementById('txt_lastname').value = result[0]['Last_Name'];
            document.getElementById('txt_email').value = result[0]['Email_ID'];
            this.setState({uEmail_ID:result[0]['Email_ID']})
            var date = new Date(result[0]['DOJ']);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var getdate = date.getDate();
            if (getdate < 10) {
                getdate = "0" + getdate;
            }
            if (month < 10) {
                month = "0" + month;
            }
            var newdate = year + "-" + month + "-" + getdate;

            document.getElementById('txt_DOJ').value = newdate;
            this.setState({uDOJ:newdate})

            document.getElementById('txt_contactno').value = result[0]['Contact_Num'];
        }
      
    }

    submitChange = async (event) => {
         
        event.preventDefault();
     
        var firstname = document.getElementById('txt_firstname');
        var lastname = document.getElementById('txt_lastname');
     
        var contactno = document.getElementById('txt_contactno');
        var current = new Date();
        var Udate = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;
       
        if (firstname.value === '') {
            alert('Please Enter First Name');
            firstname.focus();
        }
        else if (lastname.value === '') {
            alert('Please Enter Last Name');
            lastname.focus();
        }
        else if (contactno.value === '') {
            alert('Please Enter Contact Number');
            contactno.focus();
        }
        else if (contactno.value.length <10) {
            alert('Contact Number Must be 10 Digits');
            contactno.focus();
        }

        else   {
            const response = await fetch(base_url + "UpdateProfile", {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                     
                        EmpId: this.state.uEmp_ID,
                        First_Name: document.getElementById('txt_firstname').value,
                        Last_Name: document.getElementById('txt_lastname').value,
                        Email: this.state.uEmail_ID,
                        DOJ: this.state.uDOJ,
                        Contact_Num: document.getElementById('txt_contactno').value,
                        Emp_Updated_Date: Udate
                    }),
                });
                if (response.status === 200) {
                    const body = await response.text();
                    alert("Profile Updated Successfully");

                    this.GetUserProfile();


                } else {
                    alert("Profile Was Not Updated");
                }
            }

 
       
    }

    render() {
      
        return (
            <div id="wrapper">
                <div id="wrapper">
                    <div class="col-md-6">
                        <div class="row">
                            <div class="well edit-form">

                                <h2> Edit Profile</h2>
                                < form id="EditProfile" >
                                    <div class="form-group row">
                                        <label for="email_address" class="col-md-4 col-form-label text-right">Employee ID:</label>
                                        <div class="col-md-6">
                                            <input name="EmpId" id="txt_empid" class="form-control" readOnly={true} />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="email_address" class="col-md-4 col-form-label text-right">First Name:</label>
                                        <div class="col-md-6">
                                            <input type="text" name="firstname" id="txt_firstname" placeholder="FirstName" class="form-control" maxLength="15"
                                                
                                                onInput={this.NoNumbers}
                                                onKeyDown={this.onlyAlphabets}
                                                 />
                                          
                                        </div>

                                    </div>
                                    <div class="form-group row">
                                        <label for="email_address" class="col-md-4 col-form-label text-right">Last Name:</label>
                                        <div class="col-md-6">
                                            <input name="lastname" id="txt_lastname" placeholder="LastName " type="text" class="form-control" maxLength="15"
                                           
                                             onInput={this.NoNumbers} 
                                             onKeyDown={this.onlyAlphabets}
                                             />
                                         
                                        </div>

                                    </div>
                                    <div class="form-group row">
                                        <label for="email_address" class="col-md-4 col-form-label text-right">Email ID:</label>
                                        <div class="col-md-6">
                                            <input name="email" id="txt_email" type="text" class="form-control" value={localStorage["emailid"]} readOnly={true} />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="Date Of Joining" class="col-md-4 col-form-label text-right">Date Of Joining:</label>
                                        <div class="col-md-6">
                                            <input name="DOJ" id="txt_DOJ" class="form-control" readOnly={true} />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="Contact" class="col-md-4 col-form-label text-right">Contact:</label>
                                        <div class="col-md-6">
                                            <div class="input-box">
                                                <span class="prefix">+91</span>
                                                <input name="contactno" id="txt_contactno" placeholder="Contact Number" class="form-control" maxLength="10"
                                                 
                                                    onInput={this.IsPhoneNumber}/>

                                            </div>
                                           
                                        </div>
                                    </div>



                                </form>
                                <div class="forgot">

                                    <button type="submit" name="submit" className="btn btn-success" id="submit_chngpswd"
                                        onClick={this.submitChange}
                                    >Update</button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditProfile

