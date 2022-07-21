import React from 'react';
import '../CreateEmployee/CreateEmployee.css'
import { Grid, h } from "gridjs";
import $ from 'jquery';
import base_url from '../Config';

const emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);

class CreateEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            FutureDateDisable: '',
            firstname: '',
            lastname: '',
            email: '',
            employeeid: '',
            number: '',
            DOJ: '',
            roleid: '',
            password: '',

            UpdateGrid: '',
            EmployeeList: [],
            RoleList: [],
            EmpIDs: [],
            Employee_Updated_Date: '',
            E_ID: '',
            EditGetEmp_ID: '',

        }

    }

    valueChange = (e) => {


        this.setState({ [e.target.name]: e.target.value })

    }

    componentDidMount() {

        this.GetRoles();
        localStorage['PageNumber'] = ""
        localStorage["Create"] = 'Create';
        document.getElementById("idemployeeid").focus();

        document.getElementById("btnadd").style.visibility = "visible";
        document.getElementById("btnupd").style.visibility = "hidden";
        var date = new Date();
        var d1 = this.FormatDate(date);
        this.setState({ FutureDateDisable: d1 })

        this.GetEmployees();

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
        var fname = document.getElementById('idfn');
        var lname = document.getElementById('idln');
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
    IsNumber = (e) => {

        var IsNum = e.target.value;
        const re = /^[0-9\b]+$/;

        if (!isNaN(IsNum) && Math.round(IsNum) !== IsNum) {
            if (e.target.value <= 999) {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                this.setState({ employeeid: e.target.value });
                this.CheckEmpID();
            }

        }
        else {
            alert('Please Enter Digits Only');
            document.getElementById("idemployeeid").value = "";
            document.getElementById("idemployeeid").focus();
        }


    }
    IsPhoneNumber = (e) => {

        var IsPhNum = e.target.value;


        if (!isNaN(IsPhNum) && Math.round(IsPhNum) !== IsPhNum) {
            if (IsPhNum <= 9999999999) {
                IsPhNum = IsPhNum.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                this.setState({ number: IsPhNum });

            }

        }
        else {
            alert('Please Enter Digits Only');
            document.getElementById("idnumber").value = "";
            document.getElementById("idnumber").focus();
        }


    }

    CheckEmpID = async (e) => {

        const response = await fetch(base_url + "CheckEmp_ID")
        var CheckEmpID = "MS-" + document.getElementById("idemployeeid").value;


        if (response.status === 200 && CheckEmpID.length == 6) {

            var GridEmpIDs = [];
            GridEmpIDs = await response.json();

            for (var i = 0; i < GridEmpIDs.length; i++) {

                if (CheckEmpID === GridEmpIDs[i]["Emp_ID"]) {

                    alert("EmployeeID Already Exists");

                    document.getElementById("idemployeeid").value = "";
                    document.getElementById("idemployeeid").focus();
                }

            }

        }
    }

    // this was written to clear data on page after submitting page
    resetForm = async () => {

        localStorage["Create"] = 'Create';
        document.getElementById('idfn').value = "";
        document.getElementById('idln').value = "";
        for (var option of document.getElementById('idrole').options) {
            if (option.value === 'Choose Role') { option.selected = 'true'; }
        }
        document.getElementById('idemail').value = "";
        document.getElementById('idemployeeid').value = "";
        document.getElementById("iddoj").value = "";
        document.getElementById('idpassword').value = "";
        document.getElementById("idnumber").value = "";

        this.setState({ E_ID: '' });

        document.getElementById("prefix").style.visibility = 'visible';

        document.getElementById("idemployeeid").readOnly = false;
        document.getElementById('idemail').readOnly = false;
        document.getElementById('idpassword').readOnly = false;
    }

    // to get roles for dropdown
    GetRoles = async () => {

        const response = await fetch(base_url + "GetRoles")
        const RoleData = await response.json();
        this.setState({ RoleList: RoleData });
        localStorage['Roles'] = RoleData;
        let RolesArray = [];
        RolesArray = this.state.RoleList;
        localStorage['loc_Roleid[0]'] = RolesArray[0];
        var Role = document.getElementById('idrole');

        for (var i = 0; i < RolesArray.length; i++) {

            Role.innerHTML = Role.innerHTML +
                '<option value="' + RolesArray[i]['Role_ID'] + '">' + RolesArray[i]['Role_Name'] + '</option>';
        }

    }

    submitChange = async (event) => {

        event.preventDefault();


        var SetEmp_Id = "MS-" + document.getElementById("idemployeeid").value;

        var currentdate = new Date();
        var UpdatedDate = currentdate.getFullYear() + "-"
            + (currentdate.getMonth() + 1) + "-"
            + currentdate.getDate() + " "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        await this.setState({ Employee_Updated_Date: UpdatedDate })
        var vemail = document.getElementById("idemail").value;
        var vfn = document.getElementById("idfn").value;
        var vln = document.getElementById("idln").value;
        var vpassword = document.getElementById("idpassword").value;
        var vnumber = document.getElementById("idnumber").value;
        var vdoj = document.getElementById("iddoj").value;
        var vrole = document.getElementById("idrole").value;
        var vemployeeid = document.getElementById("idemployeeid").value;


        if (this.state.E_ID === '') {


            const checkEmail = await fetch(base_url + "checkEmail", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    email: document.getElementById("idemail").value.toLocaleLowerCase(),

                }),
            });


            if (vemployeeid === '') {
                alert("Please Enter EmployeeID");
                document.getElementById("idemployeeid").focus()
            }
            else if (vfn === '') {
                alert("Please Enter First Name");
                document.getElementById("idfn").focus()
            }
            else if (vln === '') {
                alert("Please Enter Last Name");
                document.getElementById("idln").focus()
            }
            else if (vdoj === '') {
                alert("Please Enter Date Of Joining");
                document.getElementById("iddoj").focus()
            }

            else if (vrole === '' || vrole === 'Choose Role') {
                alert("Please Choose a Role");
                document.getElementById("idrole").focus()
            }
            else if (vnumber === '') {
                alert("Please Enter Contact Number");
                document.getElementById("idnumber").focus()
            }
            else if (vnumber.length < 10) {
                alert("Contact Number Must Be 10 Digits");
                document.getElementById("idnumber").focus()
            }
            else if (vemail === '') {
                alert("Please Enter EmailID");
                document.getElementById("idemail").focus()
            }
            else if (!emailRegex.test(vemail)) {
                alert("Please Enter Valid Email Address");
                document.getElementById("idemail").value = "";

                document.getElementById("idemail").focus();

            }

            else if (vpassword === '') {

                alert("Please Enter Password");
                document.getElementById("idpassword").focus()
            }
            else if (vpassword.length < 10) {
                alert("Password Must Be 10 Characters");
                document.getElementById("idpassword").focus()
            }

            else if (checkEmail.status === 200) {
                const bodyo = await checkEmail.json();

                if (bodyo == '') {
                    const reslogin = await fetch(base_url + "Login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({
                            email: document.getElementById("idemail").value.toLocaleLowerCase(),
                            roleid: document.getElementById("idrole").value,
                            password: this.state.password,

                        }),
                    }

                    );
                    // getting logind
                    const resloginid = await fetch(base_url + "GetLoginID")
                    const LoginData = await resloginid.json();
                    localStorage['Login_ID'] = LoginData[0]['Login_ID'];
                    // creating employeee    

                    const response = await fetch(base_url + "CreateEmployee", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },

                        body: JSON.stringify({
                            loginid: localStorage['Login_ID'],
                            email: document.getElementById("idemail").value.toLocaleLowerCase(),
                            empolyeeid: SetEmp_Id,
                            firstname: document.getElementById("idfn").value,
                            lastname: document.getElementById("idln").value,
                            DOJ: document.getElementById("iddoj").value,
                            roleid: document.getElementById("idrole").value,
                            number: document.getElementById("idnumber").value
                        }),
                    }

                    )

                    if (response.status === 200) {
                        if (document.getElementById("idrole").value == 2) {
                            alert('Employee Successfully Created')

                        } if (document.getElementById("idrole").value == 1) {
                            alert('Manager Successfully Created')

                        }

                        this.resetForm();
                        this.UpdateGrid();
                        // sending email after creation
                        const respo = await fetch(base_url + "SendEMail", {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },

                            body: JSON.stringify({

                                loginid: localStorage['Login_ID']
                            }),
                        }

                        )

                    }
                    else {
                        alert("Not Created")
                    }

                }
                else if (bodyo[0].Email_ID == vemail) {
                    alert("EmailID Already Exists");
                    document.getElementById("idemail").value = "";
                    document.getElementById("idemail").focus();

                }

            }



        }
        else {

            if (vfn === '') {
                alert("Please Enter First Name");
                document.getElementById("idfn").focus()
            }
            else if (vln === '') {
                alert("Please Enter Last Name");
                document.getElementById("idln").focus()
            }
            else if (vdoj === '') {
                alert("Please Enter Date Of Joining");
                document.getElementById("iddoj").focus()
            }

            else if (vrole === '' || vrole === 'Choose Role') {
                alert("Please Choose a Role");
                document.getElementById("idrole").focus()
            }
            else if (vnumber === '') {
                alert("Please Enter Contact Number");
                document.getElementById("idnumber").focus()
            }
            else if (vnumber.length < 10) {
                alert("Contact Number Must Be 10 Digits");
                document.getElementById("idnumber").focus()
            }

            else {

                const upempres = await fetch(base_url + "UpdateEmployee", {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({

                        email: document.getElementById("idemail").value,
                        empolyeeid: this.state.EditGetEmp_ID,
                        firstname: document.getElementById("idfn").value,
                        lastname: document.getElementById("idln").value,
                        DOJ: document.getElementById("iddoj").value,
                        roleid: document.getElementById("idrole").value,
                        number: document.getElementById("idnumber").value,

                        Employee_Updated_Date: UpdatedDate,
                        E_ID: localStorage['E_ID'],
                    }),
                });
                //To get login based on e_id

                const LoginIDBy_Emp_ID = await fetch(base_url + "GetLoginIDBy_Emp_ID", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        E_ID: localStorage['E_ID']

                    }),
                })

                const LoginDataBy_Emp_ID = await LoginIDBy_Emp_ID.json();
                localStorage['Login_IDBy_Emp_ID'] = LoginDataBy_Emp_ID[0]['Login_ID'];

                // to update login table
                const uploginres = await fetch(base_url + "UpdateLogin", {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        email: document.getElementById("idemail").value,

                        password: document.getElementById("idpassword").value,
                        loginid: localStorage['Login_IDBy_Emp_ID'],
                        roleid: document.getElementById("idrole").value,
                        Employee_Updated_Date: UpdatedDate,

                    }),
                });

                if (upempres.status === 200) {
                    if (document.getElementById("idrole").value == 2) {
                        alert('Employee Updated Successfully ')

                    } if (document.getElementById("idrole").value == 1) {
                        alert('Manager Updated Successfully ')

                    }
                    this.setState({ UpdateGrid: 'Yes' });
                    localStorage['UpdateGrid'] = 'Yes';
                    this.resetForm();
                    this.UpdateGrid();
                }
                else {
                    alert('Update Failed');
                }
            }
        }

    }

    // to update grid
    UpdateGrid = async () => {
        const EmployeesGridData = document.getElementById('EmployeesGridData');
        this.ReadGrid();
        var Pagenum = localStorage['PageNumber'];
        if (EmployeesGridData.childNodes.length !== 0) {
            if (Pagenum > 1) {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.EmployeeList,
                        pagination: {
                            enabled: true,
                            limit: 5,
                            page: Pagenum - 1,

                        },

                    }).forceRender(document.getElementById("EmployeesGridData"));
                }, 2000);
            }
            else {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.EmployeeList,
                        pagination: {
                            enabled: true,
                            limit: 5,

                        },

                    }).forceRender(document.getElementById("EmployeesGridData"));
                }, 2000);
            }

        }

    }
    // edit employee
    EditEmployee = async (EmployeeRowArray) => {
        document.getElementById("idfn").focus();

        localStorage["Create"] = "Update";
        localStorage["Edit"] = "true";
        localStorage['E_ID'] = EmployeeRowArray[0];
        document.getElementById("btnadd").style.visibility = "visible";
        document.getElementById("btnupd").style.visibility = 'hidden';
        document.getElementById("prefix").style.visibility = 'hidden';
        await this.setState({ E_ID: EmployeeRowArray[0] });
        await this.setState({ EditGetEmp_ID: EmployeeRowArray[1] })
        document.getElementById("idemployeeid").value = EmployeeRowArray[1];

        document.getElementById("idfn").value = EmployeeRowArray[2];
        document.getElementById("idln").value = EmployeeRowArray[3];
        document.getElementById("idemail").value = EmployeeRowArray[4];

        document.getElementById("idemail").readOnly = true;
        document.getElementById("idpassword").readOnly = true;
        document.getElementById("idemployeeid").readOnly = true;


        var RoleName = EmployeeRowArray[5];
        for (var option of document.getElementById('idrole').options) {
            if (option.value !== 'Choose Role' && option.label !== '') {
                if (RoleName.includes(option.label) === true) {
                    option.selected = 'true';
                    break;
                }
            }

        }
        var date = new Date(EmployeeRowArray[6]);
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
        document.getElementById("iddoj").value = newdate;
        document.getElementById("idnumber").value = EmployeeRowArray[7];
        document.getElementById("idpassword").value = EmployeeRowArray[8];

    }
    // delete employee
    DeleteEmployee = async (E_ID) => {
        const response = await fetch(base_url + "DeleteEmployee", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                E_ID: E_ID

            }),
        });
        if (response.status === 200) {
            const body = await response.text();

            if (body === 'Success') {

                this.setState({ UpdateGrid: 'Yes' });
                localStorage['UpdateGrid'] = 'Yes';

                this.UpdateGrid();
            }
            else {
                alert(' Employee Deletion is Failed');
            }
        }
        else if (response.status === 400) {
            alert("Error");
        }

    }
    //used to send date only to database
    FormatDate(date1) {
        var currentdate = new Date(date1);
        var month = currentdate.getMonth() + 1;
        var date = currentdate.getDate();
        if (date < 10) {
            date = '0' + date;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var OnlyDate = currentdate.getFullYear() + "-"
            + month + "-" + date;
        return OnlyDate;
    }
    ReadGrid = async () => {

        const response = await fetch(base_url + "GetEmployeesList")

        if (response.status === 200) {
            let EmpData = [];
            EmpData = await response.json();
            for (var i = 0; i < EmpData.length; i++) {

                var dateofjoining = this.FormatDate(EmpData[i]['DOJ'])
                EmpData[i]['DOJ'] = dateofjoining;
            }

            await this.setState({ EmployeeList: EmpData });

        };
    }

    GetEmployees = async () => {

        this.ReadGrid();
        const griddata = document.getElementById('EmployeesGridData');

        if (griddata.childNodes.length === 0) {

            this.mygrid = new Grid({
                columns: [
                    {
                        id: 'E_ID', name: 'E_Id ', hidden: 'true'
                    },

                    {
                        id: 'Emp_ID', name: 'ID'
                    },
                    {
                        id: 'First_Name', name: 'First Name'
                    },
                    {
                        id: 'Last_Name', name: 'Last Name'
                    },
                    {
                        id: 'Email_ID', name: 'Email ID'
                    },
                    {
                        id: 'Role_Name', name: 'Role'
                    },
                    {
                        id: 'DOJ', name: 'Date Of Joining'
                    },
                    {
                        id: 'Contact_Num', name: 'Contact'
                    },
                    {
                        id: 'Password', name: 'Password', hidden: 'true'
                    },
                    {
                        name: 'Edit',
                        formatter: (cell, row) => {
                            return h('button', {

                                className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600 btn btn-success',
                                onClick: () => {

                                    let EmployeeRowArray = [];

                                    let count = `${row.cells.length}`;
                                    let i = 0;
                                    while (count > 0) {
                                        EmployeeRowArray[i] = `${row.cells[i].data}`;
                                        i++;
                                        count--;
                                    }
                                    var pagenumber = $(".gridjs-currentPage").text();

                                    localStorage['PageNumber'] = pagenumber;

                                    this.EditEmployee(EmployeeRowArray)
                                }
                            }, 'Edit');

                        }

                    },

                    {
                        name: 'Delete',
                        formatter: (cell, row, Page) => {
                            return h('button', {
                                className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600 btn btn-danger',

                                onClick: () => {

                                    let E_ID = `${row.cells[0].data}`;
                                    let EMP_ID = `${row.cells[1].data}`;
                                    localStorage['E_ID'] = E_ID;
                                    localStorage['employeeid'] = EMP_ID

                                    if (window.confirm(`Confirm To Delete EmployeeID: ${EMP_ID}`)) {

                                        this.DeleteEmployee(E_ID);
                                        alert(`${EMP_ID} Was Deleted`)
                                        var pagenumber = $(".gridjs-currentPage").text();
                                        localStorage['PageNumber'] = pagenumber;
                                    } else {

                                        alert(`${EMP_ID} not Deleted`)
                                    }

                                }
                            }, 'Delete');
                        }
                    },
                ],

                data: this.state.EmployeeList,
                data: () => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                            resolve(this.state.E_ID), 2000);
                    });
                },
                language: {
                    'search': {
                        'placeholder': '🔍 Search...'
                    },

                },
                style: {
                    table: {
                        'border': '3px solid #ccc',


                    },
                    th: {
                        'background-color': '#044981',
                        'color': '#fff',
                        'border-bottom': '3px solid #ccc',
                        'text-align': 'center'
                    },
                    td: {
                        'text-align': 'left',
                        'padding': '2px',
                        'border': '1px solid #ccc'

                    }
                },
                search: {
                    enabled: true,

                },

                resizable: true,
                //sort:true,
                pagination: {
                    enabled: true,
                    limit: 5,
                    page: 0,
                    resetPageonUpdate: false


                },
            })
                .render(document.getElementById("EmployeesGridData"));
        } else {

            setTimeout(() => {

                this.mygrid.updateConfig({

                    data: this.state.EmployeeList,
                })
                    .forceRender(document.getElementById("EmployeesGridData"));
            }, 2000);


        }
    }

    render() {

        return (

            <div id="wrapper">
                <div class="col-md-12"><h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Create Employee</h3></div>
                <form id="login" >

                    <div class="form-row" id="form-row">
                        <div className="form-group col-md-4">
                            <label className="required">Employee ID:</label>

                            <div class="input-box" id="eeid">

                                <span class="prefix" id="prefix">MS-</span>
                                <input type="text" prefix={"MS-"} maxLength="3" id='idemployeeid' name='employeeid'

                                    onChange={this.IsNumber}
                                    placeholder="EmployeeID" className="form-control"
                                /></div>

                        </div>
                        <div class="form-group col-md-4">
                            <label >First Name:</label>
                            <input type="text" id="idfn" name='firstname'
                                onKeyDown={this.onlyAlphabets} maxLength="15"
                                onInput={this.NoNumbers}
                                placeholder="First Name" className="form-control"
                            />

                        </div>
                        <div class="form-group col-md-4">
                            <label >Last Name:</label>
                            <input type="text" id="idln" name='lastname'
                                placeholder="Last Name" className="form-control"
                                onKeyDown={this.onlyAlphabets} maxLength="15"
                                onInput={this.NoNumbers}
                            />

                        </div>

                    </div>&nbsp;&nbsp;&nbsp;
                    <div className='form-row'>
                        <div class="form-group col-md-4">
                            <label className="required">Date of Joining:</label>

                            <input name="DOJ" id="iddoj" type="date"
                                max={this.state.FutureDateDisable}
                                placeholder="Date Of Joining"
                                className="form-control" />

                        </div>
                        <div class="form-group col-md-4">
                            <label className="required">Role:</label>
                            <select
                                className="form-control"
                                id="idrole" name="roleid" onChange={this.valueChange}  >
                                <option selected >Choose Role</option>
                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label>Contact Number:</label>
                            <div class="input-box">
                                <span class="prefix">+91</span>
                                <input type="text" id='idnumber' name='number' maxLength="10"
                                    onInput={this.IsPhoneNumber}

                                    placeholder="Contact Number" className="form-control"
                                /></div>

                        </div>
                    </div> &nbsp;&nbsp;&nbsp;
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label className="required">Email(Login_Id):</label>
                            <input type="email" id="idemail" name="email"

                                placeholder="Email" className="form-control"
                            />

                        </div>

                        <div class="form-group col-md-6">
                            <label className="required">Password:</label>
                            <input type="password" id="idpassword" name='password' onChange={this.valueChange} maxLength="10"
                                placeholder="Password" className="form-control" />

                        </div>

                    </div>&nbsp;&nbsp;&nbsp;

                    <div className='form-row'>
                        <div class="form-group col-md-4">

                            <input type="submit" name="submit" id='btnadd' onClick={this.submitChange} className="btn btn-success" value={localStorage["Create"]} />&nbsp;&nbsp;&nbsp;
                            <input type="button" name="Cancel" id='btncan' onClick={this.resetForm} className="btn btn-danger" value="Cancel" />&nbsp;&nbsp;&nbsp;
                            <input type="button" name="Update" id='btnupd' onClick={this.submitChange} className="btn btn-success" value="Update" />
                        </div>

                    </div>
                </form>
                <div class="col-md-12">
                    <h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}> Employees Details </h3>
                </div>
                <div class="col-lg-12">
                    <div id="EmployeesGridData" ></div>
                </div>


            </div>
        );
    }
}

export default CreateEmployee;



