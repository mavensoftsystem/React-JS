import '../projectcreation/projectcreation.css'
import React from 'react';
import { Grid, h } from "gridjs";
import base_url from '../Config';
import $ from 'jquery';
class ProjectCreation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabledate: '',
            projectname: '',
            domain: '',
            descripction: '',
            startdate: '',
            Projectview: [],
            ProjectsList: [],
            ProjectArray: [],
            projectid: '',
            UpdateGrid: '',
            ValidOrNot: '',
            IsActive: '',
            Proj_Updated_Date: '',
            P_ID: '',
            enddate: '',

        }



    }
    clearData = () => {
        localStorage["Create"] = "Create";
        document.getElementById("btnupd").style.visibility = 'hidden'
        document.getElementById("btnadd").style.visibility = 'visible';
        document.getElementById('txtpname').value = "";

        for (var option of document.getElementById('domain').options) {
            if (option.value === 'Select Domain') {
                option.selected = 'true';
            }
        }

        document.getElementById('txtdescripction').value = "";
        document.getElementById('txtdate').value = "";
        this.setState({ P_ID: '' });
    }
    componentDidMount() {

        localStorage['PageNumber'] = "";
        localStorage["Create"] = "Create";
        document.getElementById("txtpname").focus();
        localStorage['ProjectsList'] = '';
        this.GetProjectsList();
        document.getElementById("btnadd").style.visibility = "visible";
        document.getElementById("btnupd").style.visibility = "hidden";
        var d = new Date()
        var d1 = this.FormatDate(d);
        this.setState({ disabledate: d1 });
    }
    async Validations() {

        var projectname = document.getElementById('txtpname');
        var domain = document.getElementById('domain');
        var description = document.getElementById('txtdescripction');
        var startdate = document.getElementById('txtdate');
        if (projectname.value === '') {
            alert('Please Enter the  Project Name');
            projectname.focus();

        }
        else if (domain.value === 'Select Domain' || domain.value === '') {
            alert('Please Select Domain');
            domain.focus();

        }

        else if (startdate.value === "") {
            alert('Please Select Date.');
            startdate.focus();

        }
        else if (description.value === '') {
            alert('Please Enter Description');
            description.focus();

        }
        else {
            localStorage['ValidOrNot'] = 'Yes';

            var pname = projectname.value;
            localStorage['projectname'] = pname;
            var domain = domain.value;
            localStorage['domain'] = domain;
            var des = description.value;
            localStorage['description'] = des;
            var date = startdate.value;
            localStorage['startdate'] = date;
        }
    }
    CheckProjects = async () => {
        const response = await fetch(base_url + "GetProjectReportList")
        var CheckProject = document.getElementById("txtpname").value;


        if (response.status === 200) {

            var Project_Name = [];
            Project_Name = await response.json();

            for (var i = 0; i < Project_Name.length; i++) {

                if (CheckProject === Project_Name[i]["Proj_Name"]) {

                    alert("Project Name Is Already Exists");

                    document.getElementById("txtpname").value = "";

                }

            }

        }
    }
    valueChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }
    submitChange = async (event) => {

        event.preventDefault();
        localStorage['ValidOrNot'] = '';
        this.Validations();
        if (localStorage['ValidOrNot'] === 'Yes') {
            var currentdate = new Date();
            var CurrentLongDate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            await this.setState({ Proj_Created_Date: CurrentLongDate })
            await this.setState({ Proj_Updated_Date: CurrentLongDate })

            if (this.state.P_ID === '') {

                const response = await fetch(base_url + "createproject", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        Proj_ID: '',
                        Proj_Name: document.getElementById("txtpname").value,
                        Proj_Domain: this.state.domain,
                        IsActive: 'YES',
                        Proj_Start_Date: document.getElementById("txtdate").value,
                        Proj_Desc: this.state.descripction,
                        Proj_Created_Date: CurrentLongDate,

                    }),


                })
                if (response.status === 200) {

                    const body = await response.text();

                    if (body === 'Success') {
                        alert("Project Created  Sucessfully");
                        this.clearData();
                        this.UpdateGrid();
                    }
                    else {
                        alert('Insertion Fail');
                    }
                }
            }

            else {
                const response = await fetch(base_url + "UpdateProjects", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({

                        Proj_Name: localStorage['projectname'],
                        Proj_Domain: localStorage['domain'],
                        Proj_Desc: localStorage['description'],
                        Proj_Start_Date: localStorage['startdate'],
                        Proj_Updated_Date: CurrentLongDate,
                        P_ID: localStorage['P_ID'],
                    }),
                });
                if (response.status === 200) {
                    const body = await response.text();

                    if (body === 'Success') {
                        alert("Project  Updated  Sucessfully");
                        this.setState({ UpdateGrid: 'Yes' });
                        localStorage['UpdateGrid'] = 'Yes';

                        this.clearData();
                        this.UpdateGrid();
                    }
                    else {
                        alert('Project Update Failed');
                    }
                }

            }
        }
    }
    async UpdateGrid() {

        const ProjectGridData = document.getElementById('ProjectGridData');
        this.ReadGrid();
        var Pagenum = localStorage['PageNumber'];
        if (ProjectGridData.childNodes.length !== 0) {

            if (Pagenum > 1) {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.ProjectsList,
                        pagination: {
                            enabled: true,
                            limit: 5,
                            page: Pagenum - 1,
                        },

                    }).forceRender(document.getElementById("ProjectGridData"));
                }, 2000);
            }
            else {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.ProjectsList,
                        pagination: {
                            enabled: true,
                            limit: 5,
                        },

                    }).forceRender(document.getElementById("ProjectGridData"));
                }, 2000);
            }

        }

    }

    async EditProjects(ProjectRowArray) {
        document.getElementById("txtpname").focus();
        localStorage["Create"] = "Update";
        localStorage["Edit"] = "true";
        localStorage['P_ID'] = ProjectRowArray[0];
        document.getElementById("btnadd").style.visibility = "visible";
        document.getElementById("btnupd").style.visibility = 'hidden';
        await this.setState({ P_ID: ProjectRowArray[0] });
        document.getElementById("txtpname").value = ProjectRowArray[1];
        document.getElementById("domain").value = ProjectRowArray[2];
        document.getElementById("txtdescripction").value = ProjectRowArray[4];
        var date = new Date(ProjectRowArray[3]);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var date1 = date.getDate();
        if (date1 < 10) {
            date1 = "0" + date1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var newdate = year + "-" + month + "-" + date1;

        document.getElementById("txtdate").value = newdate;
    }
    async DeleteProject(P_ID) {
        const response = await fetch(base_url + "DeleteProject", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                P_ID: P_ID

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
                alert(' Project Deletion Is Failed');
            }
        }
        else if (response.status === 400) {
            alert("Error");
        }

    }
    FormatDate(date) {
        var currentdate = new Date(date);
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
    async ReadGrid() {

        const response = await fetch(base_url + "GetProjectsLists")
        if (response.status === 200) {
            let ProjectsData = [];
            ProjectsData = await response.json();
            for (var i = 0; i < ProjectsData.length; i++) {
                var Start_Date = this.FormatDate(ProjectsData[i]['Proj_Start_Date'])
                ProjectsData[i]['Proj_Start_Date'] = Start_Date;
            }
            await this.setState({ ProjectsList: ProjectsData });
        };
    }


    async GetProjectsList() {
        this.ReadGrid();

        const griddata = document.getElementById('ProjectGridData');

        if (griddata.childNodes.length === 0) {
            this.mygrid = new Grid({
                columns: [
                    {
                        id: 'P_ID', name: 'Project Id ', hidden: 'true'
                    },
                    {
                        id: 'Proj_Name', name: 'Project Name '
                    },
                    {
                        id: 'Proj_Domain', name: 'Domain '
                    },

                    {
                        id: 'Proj_Start_Date', name: 'Start Date'
                    },
                    {
                        id: 'Proj_Desc', name: 'Description'
                    },
                    {
                        name: 'Edit',
                        formatter: (cell, row) => {
                            return h('button', {

                                className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600 btn btn-success',
                                onClick: () => {

                                    let ProjectRowArray = [];

                                    let count = `${row.cells.length}`;
                                    let i = 0;
                                    while (count > 0) {
                                        ProjectRowArray[i] = `${row.cells[i].data}`;
                                        i++;
                                        count--;
                                    }
                                    var pagenumber = $(".gridjs-currentPage").text();
                                    localStorage['PageNumber'] = pagenumber;
                                    this.EditProjects(ProjectRowArray)
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

                                    let P_ID = `${row.cells[0].data}`;
                                    let Proj_Name = `${row.cells[1].data}`;
                                    localStorage['P_ID'] = P_ID;
                                    localStorage['Proj_Name'] = Proj_Name;

                                    if (window.confirm(`Do You Want To Delete The Project ? ${Proj_Name}`)) {
                                        var pagenumber = $(".gridjs-currentPage").text();
                                        localStorage['PageNumber'] = pagenumber;
                                        this.DeleteProject(P_ID);
                                        alert(`${Proj_Name} Was Deleted`)
                                    }

                                }
                            }, 'Delete');
                        }
                    },
                ],

                data: this.state.ProjectsList,
                data: () => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                            resolve(this.state.P_ID), 1000);
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
                pagination: {
                    enabled: true,
                    limit: 5,
                    page: 0,
                    resetPageonUpdate: false
                },
            })
                .render(document.getElementById("ProjectGridData"));
        } else {
            setTimeout(() => {
                this.mygrid.updateConfig({

                    data: this.state.ProjectsList,
                })
                    .forceRender(document.getElementById("ProjectGridData"));
            }, 1000);


        }
    }
    render() {
        return (
            <div id="wrapper">
                <div class="col-md-12"><h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Projects Creation</h3></div>
                <form id="reg" onSubmit={this.submitChange}>
                    <div class="form-row">
                        <div class="form-group col-md-4">
                            Project Name : <input class="form-control" maxLength={20} type="text" id='txtpname' name="projectname" onChange={this.CheckProjects} placeholder="Project Name" />
                        </div>
                        <div class="form-group col-md-4">
                            Select Domain: <select id="domain" onChange={this.valueChange} class="form-control" name="domain">
                                <option selected> Select Domain</option>
                                <option> Advertising </option>
                                <option> Banking</option>
                                <option>Finance </option>
                                <option>  Health Care</option>
                                <option> Insurance</option>
                                <option>Telecom </option>
                                <option>Others</option>
                            </select>
                        </div>
                        <div className='form-group col-md-4'>
                            Start Date  :
                            <input type="date" className="form-control" id='txtdate' name='startdate' max={this.state.disabledate} />

                        </div>
                    </div>
                    <div class="form-row">


                        <div class="form-group col-md-12">
                            Description : <textarea id='txtdescripction' maxLength={500} name="descripction" cols="40" rows="5" onChange={this.valueChange} placeholder='Enter Project Details' class="form-control"></textarea>
                        </div>
                    </div>
                    <div className='form-row'>
                        <div class="form-group col-md-4">

                            <input type="submit" name="submit" id='btnadd' onClick={this.submitChange} className="btn btn-success" value={localStorage["Create"]} />&nbsp;&nbsp;&nbsp;
                            <input type="button" name="Cancel" id='btncan' onClick={this.clearData} className="btn btn-danger" value="Cancel" />&nbsp;&nbsp;&nbsp;
                            <input type="button" name="Update" id='btnupd' onClick={this.submitChange} className="btn btn-success" value="Update" />
                        </div>




                    </div>



                </form>
                <div class="col-md-12"> <h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}> Projects Details</h3></div>
                <div class="col-lg-12">

                    <div id="ProjectGridData" ></div>


                </div>
            </div>



        );
    }
}

export default ProjectCreation;