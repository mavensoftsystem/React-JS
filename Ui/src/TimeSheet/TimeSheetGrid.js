import '../TimeSheet/Timesheet.css'
import React from 'react'
import $ from 'jquery';
import "gridjs/dist/theme/mermaid.css";
import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import moment from 'moment';
import base_url from '../Config';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"
class TimeSheetGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            FutureDateDisable: '',
            UpdateGrid: '',
            Efforts: '',
            FromDate: [],
            ToDate: [],
            DateList: [],
            AssignProjTasks: [],
            EmpTimesheet: [],
            GridTasks: [],
        }

    }

    componentDidMount() {
        this.GetAssignProjTasks();
        this.EmpTimeSheetGrid();
        this.GetC_DateList();
        var dd = new Date();
        var monday = this.getMonday(dd);

        document.getElementById("WeekDay").style.visibility = 'hidden';
        document.getElementById('WeekDay').defaultValue = this.FormatDate(monday);

        localStorage["Create"] = "Create";

        document.getElementById('Project').focus();
        localStorage['TaskLists'] = '';

        var d1 = this.FormatDate(dd);
        this.setState({ FutureDateDisable: d1 })

        var d1 = this.nextweek(dd);

        this.setState({ FutureDateDisable: d1 })

    }
    nextweek = (d) => {

        var d = new Date();
        var today = this.getMonday(d);

        var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        return nextweek;
    }

    getMonday = (d) => {

        d = new Date(d);

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    getTuesday = (d) => {

        d = new Date(d);

        var day = d.getDay(),
            diff = d.getDate() - day + (day == 1 ? -5 : 2); // adjust when day is sunday
        return new Date(d.setDate(diff));
    }

    GetC_DateList = () => {

        var d = document.getElementById('WeekDay').value;

        document.getElementById('lbld1').innerHTML = this.FormatDate(d);
        var Tuesday = this.getTuesday(d);

        document.getElementById('lbld2').innerHTML = this.FormatDate(Tuesday);

        var startOfWeek = moment().startOf('isoweek').toDate();

        var tue = moment(startOfWeek).add(1, 'days').toDate();
        var wed = moment(startOfWeek).add(2, 'days').toDate();
        var thu = moment(startOfWeek).add(3, 'days').toDate();
        var fri = moment(startOfWeek).add(4, 'days').toDate();
        var sat = moment(startOfWeek).add(5, 'days').toDate();
        var endOfWeek = moment().endOf('isoweek').toDate();

        var monDay = moment(startOfWeek).format("DD-MM");
        var tueDay = moment(tue).format("DD-MM");
        var wedDay = moment(wed).format("DD-MM");
        var thuDay = moment(thu).format("DD-MM");
        var friDay = moment(fri).format("DD-MM");
        var satDay = moment(sat).format("DD-MM");
        var sunDay = moment(endOfWeek).format("DD-MM");

        document.getElementById("lbld1").innerHTML = monDay;
        document.getElementById("lbld2").innerHTML = tueDay;
        document.getElementById("lbld3").innerHTML = wedDay;
        document.getElementById("lbld4").innerHTML = thuDay;
        document.getElementById("lbld5").innerHTML = friDay;
        document.getElementById("lbld6").innerHTML = satDay;
        document.getElementById("lbld7").innerHTML = sunDay;

    }


    GetAssignProjTasks = async () => {



        const response = await fetch(base_url + "GetAssignProjTasks", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                E_ID: localStorage['E_ID'],
            }),
        });
        if (response.status === 200) {
            const A_Tasks = await response.json();
            this.setState({ AssignProjTasks: A_Tasks });

            localStorage['Projects'] = A_Tasks;
            let ProjectsArray = [];
            ProjectsArray = this.state.AssignProjTasks;
            var project = document.getElementById('Project');
            for (var i = 0; i < ProjectsArray.length; i++) {
                var ProjLength = project.options.length;
                if (ProjLength > 1) {
                    var count = 0;
                    for (var j = 0; j < ProjLength; j++) {
                        const text = project.options[j].text;
                        const value = project.options[j].value;
                        console.log("value ::" + value + " : PID  ::" + ProjectsArray[i]['P_ID']);
                        if (parseInt(value) === parseInt(ProjectsArray[i]['P_ID'])) {
                            count++;
                        }
                    }
                    if (count === 0) {
                        project.innerHTML = project.innerHTML +
                            '<option value="' + ProjectsArray[i]['P_ID'] + '">' + ProjectsArray[i]['Proj_Name'] + '</option>';

                    }
                }
                else {
                    project.innerHTML = project.innerHTML +
                        '<option value="' + ProjectsArray[i]['P_ID'] + '">' + ProjectsArray[i]['Proj_Name'] + '</option>';

                }


            }
        }
    }

    FormatDate = (date1) => {
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


    weekday = () => {

        var d = document.getElementById('WeekDay').value;


        var monday = this.getMonday(d);

        document.getElementById('WeekDay').value = this.FormatDate(monday);
        var d1 = this.FormatDate(monday);

        var tue = moment(d1).add(1, 'days').toDate();
        var wed = moment(d1).add(2, 'days').toDate();
        var thu = moment(d1).add(3, 'days').toDate();
        var fri = moment(d1).add(4, 'days').toDate();
        var sat = moment(d1).add(5, 'days').toDate();
        var sun = moment(d1).add(6, 'days').toDate();
        var endOfWeek = moment().endOf('d1').toDate();

        var monDay = moment(d1).format("MM/DD/YYYY");
        var tueDay = moment(tue).format("MM/DD/YYYY");
        var wedDay = moment(wed).format("MM/DD/YYYY");
        var thuDay = moment(thu).format("MM/DD/YYYY");
        var friDay = moment(fri).format("MM/DD/YYYY");
        var satDay = moment(sat).format("MM/DD/YYYY");
        var sunDay = moment(sun).format("MM/DD/YYYY");

        document.getElementById("lbld1").innerHTML = monDay;
        document.getElementById("lbld2").innerHTML = tueDay;
        document.getElementById("lbld3").innerHTML = wedDay;
        document.getElementById("lbld4").innerHTML = thuDay;
        document.getElementById("lbld5").innerHTML = friDay;
        document.getElementById("lbld6").innerHTML = satDay;
        document.getElementById("lbld7").innerHTML = sunDay;

    }

    IsNumber = (e) => {

        if (e.target.value <= 12.0) {
            e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        }
        else {
            e.target.value = e.target.value.slice(0, e.target.value.length - 1);
            alert('You can not enter more than 12 hours');
        }


    }

    GetTimesheetList = async () => {


        const response = await fetch(base_url + "GetTimeSheet_ByEmp", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                E_ID: localStorage['E_ID'],
                Week_Start_Date: document.getElementById("WeekDay").value
            }),
        });
        if (response.status === 200) {
            const myTimesheet = await response.json();

            var tasks = []

            for (var i = 0; i < myTimesheet.length; i++) {
                var Week_Start_Date = this.FormatDate(myTimesheet[i]['Week_Start_Date'])
                myTimesheet[i]['Week_Start_Date'] = Week_Start_Date;
                var Created_Date = this.FormatDate(myTimesheet[i]['Created_Date'])
                myTimesheet[i]['Created_Date'] = Created_Date;

                tasks.push(myTimesheet[i]['Ts_TAID']);
            }
            this.setState({ EmpTimesheet: myTimesheet });
            this.setState({ GridTasks: tasks });

        }

    }


    EmpTimeSheetGrid = () => {

        this.GetTimesheetList();

        const TimesheetGrid = document.getElementById('TimesheetGrid');
        if (TimesheetGrid.childNodes.length === 0) {

            this.mygrid = new Grid({
                columns: [

                    {
                        id: 'Ts_ID', name: 'Ts_ID', hidden: true
                    },

                    {
                        id: 'Week_Start_Date', name: 'Week_Start_Date',
                    },
                    {
                        id: 'Created_Date', name: 'Created_Date', hidden: true
                    },
                    {
                        id: 'Proj_Name', name: 'Project'
                    },

                    {
                        id: 'Task_Name', name: 'Task'

                    },
                    {
                        id: 'D1', name: 'D1'
                    },
                    {
                        id: 'D2', name: 'D2'
                    },
                    {
                        id: 'D3', name: 'D3'
                    },
                    {
                        id: 'D4', name: 'D4'
                    },
                    {
                        id: 'D5', name: 'D5'
                    },
                    {
                        id: 'D6', name: 'D6'
                    },
                    {
                        id: 'D7', name: 'D7'
                    },
                    {
                        id: 'Task_ID', name: 'TA_ID', hidden: true
                    },
                    {
                        name: 'Edit',
                        formatter: (cell, row, Page) => {
                            return h('button', {
                                className: 'btn btn-success',
                                onClick: () => {
                                    let TsArray = []; let i = 0;
                                    let count = `${row.cells.length}`;

                                    while (count > 0) {
                                        TsArray[i] = `${row.cells[i].data}`;
                                        i++;
                                        count--;
                                    };
                                    var pagenumber = $(".gridjs-currentPage").text();

                                    localStorage['PageNumber'] = pagenumber;

                                    this.GetC_DateList();

                                }
                            }, 'Edit');


                        }

                    },

                ],

                data: () => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                            resolve(this.state.EmpTimesheet), 2000);
                    });
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


                resizable: true,
                pagination: {
                    enabled: true,
                    limit: 5,
                    page: 0,
                    resetPageonUpdate: false

                },
            })
                .render(document.getElementById("TimesheetGrid"));
        } else {

        }
    }
    UpdateTimesheetGrid = async () => {
        const tsGrid = document.getElementById('TimesheetGrid');

        var Pagenum = localStorage['PageNumber'];
        if (tsGrid.childNodes.length !== 0) {
            if (Pagenum > 1) {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        //search: true,
                        data: this.state.EmpTimesheet,
                        pagination: {
                            enabled: true,
                            limit: 5,
                            page: Pagenum - 1,


                        },

                    }).forceRender(document.getElementById("TimesheetGrid"));
                }, 2000);
            }
            else {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        // search: true,
                        data: this.state.EmpTimesheet,
                        pagination: {
                            enabled: true,
                            limit: 5,

                        },

                    }).forceRender(document.getElementById("TimesheetGrid"));
                }, 2000);
            }

        }

    }

    CheckTaskName = async (e) => {

        var CheckTaskName = this.state.GridTasks

        var Tname = document.getElementById('TaskName').value;

        for (var i = 0; i < CheckTaskName.length; i++) {
            if (Tname == CheckTaskName[i]) {

                alert("Time Sheet For This Task Was Already Created,Please Edit To Use The Same Task");
                document.getElementById('TaskName').value = "Choose Task"
            } else {

            }
        }

    }
    GetAssignTasks = async () => {

        var P_ID = document.getElementById('Project');
        var Tname = document.getElementById('TaskName');
        var A_Tasks = this.state.AssignProjTasks;

        var i, L = Tname.options.length - 1;
        for (i = L; i >= 0; i--) {

            if (Tname[i].value !== 'Choose Task') {
                Tname.remove(i);
            }

        }
        for (var i = 0; i < A_Tasks.length; i++) {
            if (A_Tasks[i]['P_ID'] == P_ID.value) {
                Tname.innerHTML = Tname.innerHTML +
                    '<option value="' + A_Tasks[i]['TA_ID'] + '">' + A_Tasks[i]['Task_Name'] + '</option>';
            }

        }

    }
    ResetForm = () => {
        localStorage['Ts_ID'] = '';
        document.getElementById('CreateTs').value = 'Create';

        var TProject = document.getElementById("Project")
        var Tname = document.getElementById('TaskName');
        TProject.removeAttribute("disabled", true);
        Tname.removeAttribute("disabled", true);
        var i, L = Tname.options.length - 1;
        for (i = L; i >= 0; i--) {

            if (Tname[i].value !== 'Choose Task') {
                Tname.remove(i);
            }

        }

        var IDD = ['Project', 'TaskName', 'WeekDay', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'];
        var ID1 = ['Project', 'TaskName', 'WeekDay'];

        var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '-');

        var monday = this.getMonday(utc);
        var Sl = ['Choose Project', 'Choose Task', monday.toJSON().slice(0, 10).replace(/-/g, '-')];
        for (var i = 0; i < 10; i++) {

            if (IDD[i] === ID1[i]) {
                document.getElementById(IDD[i]).value = Sl[i];
            }
            else {
                document.getElementById(IDD[i]).value = '';

            }

        }
        this.GetC_DateList();
    }
    ValTimeSheet = async () => {

        var count = 0;
        var dd = ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'];
        var ID1 = ['Project', 'TaskName'];
        var Sl = ['Choose Project', 'Choose Task'];
        for (var i = 0; i < 2; i++) {

            if (document.getElementById(ID1[i]).value === Sl[i]) {
                alert(Sl[i]);
                document.getElementById(ID1[i]).focus();
                return false;
            }
        }
        for (var j = 0; j < 7; j++) {

            if (document.getElementById(dd[j]).value === '' || document.getElementById(dd[j]).value === '0') {
                count++;
            }
        }
        if (count === 7) {
            alert('Please Enter Hours For One Day Atleast');
            return false;
        }
        else {
            var IDD = ['Project', 'TaskName', 'WeekDay', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'];
            var VV = ['P_ID', 'TA_ID', 'WDate', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'];
            for (i = 0; i < 10; i++) {

                if (document.getElementById(IDD[i]).value === '') {
                    localStorage[VV[i]] = 0;
                }
                else {
                    localStorage[VV[i]] = document.getElementById(IDD[i]).value;
                }

            }
            return true;
        }
    }
    handleSubmit = async () => {

        var result = await this.ValTimeSheet();


        if (result === true) {

            if (document.getElementById('CreateTs').value === 'Create') {
                const responseo = await fetch(base_url + "CreateTimesheet", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        // E_ID: 5,
                        E_ID: localStorage['E_ID'],
                        P_ID: localStorage['P_ID'],
                        TA_ID: localStorage['TA_ID'],
                        WDate: localStorage['WDate'],
                        D1: localStorage['D1'],
                        D2: localStorage['D2'],
                        D3: localStorage['D3'],
                        D4: localStorage['D4'],
                        D5: localStorage['D5'],
                        D6: localStorage['D6'],
                        D7: localStorage['D7'],

                    }),
                });
                if (responseo.status === 200) {
                    const bodyo = await responseo.text();

                    if (bodyo === 'Success') {
                        alert("Timesheet Created Successfully");
                        this.ResetForm();
                        this.GetTimesheetList();
                        this.UpdateTimesheetGrid();
                    }
                    else {
                        alert('Task Creation is Failed');
                    }
                }
                else if (responseo.status === 400) {
                    alert("Timesheet Creation Was Failed, Due Server Error Issue");
                }
            }
            else {
                var currentdate = new Date();
                var UpdatedDate = currentdate.getFullYear() + "-"
                    + (currentdate.getMonth() + 1) + "-"
                    + currentdate.getDate() + " "
                    + currentdate.getHours() + ":"
                    + currentdate.getMinutes() + ":"
                    + currentdate.getSeconds();

                await this.setState({ Timesheet_Updated_Date: UpdatedDate })

                const responseo = await fetch(base_url + "UpdateTimesheet", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        Ts_ID: localStorage['Ts_ID'],
                        P_ID: localStorage['P_ID'],
                        TA_ID: localStorage['TA_ID'],
                        D1: localStorage['D1'],
                        D2: localStorage['D2'],
                        D3: localStorage['D3'],
                        D4: localStorage['D4'],
                        D5: localStorage['D5'],
                        D6: localStorage['D6'],
                        D7: localStorage['D7'],
                        Timesheet_Updated_Date: UpdatedDate,
                    }),
                });
                if (responseo.status === 200) {
                    const bodyo = await responseo.text();

                    if (bodyo === 'Success') {
                        alert("Timesheet Updated Successfully");
                        this.ResetForm();
                        this.GetTimesheetList();
                        this.UpdateTimesheetGrid();
                    }
                    else {
                        alert('Timesheet Update is Failed');
                    }
                }
                else if (responseo.status === 400) {
                    alert("Timesheet Updation Was Failed, Due Server Error Issue");
                }
            }
        }


    }

    render() {

        return (
            <div>
                <form >

                    <div id="wrapper">
                        <div class="col-md-12">  <h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Timesheet</h3></div>
                        <div class="col-md-12">

                            <div class="form-group col-md-4">
                                <input type='date' id="WeekDay"
                                    onChange={this.weekday}
                                    max={this.state.FutureDateDisable}
                                />

                            </div>

                        </div>
                        <div className="clear_fix"></div>

                        <div  >
                            <div class="form-row">
                                <div class="form-group col-md-2">
                                    <label>Project</label> :   <select id="Project" class="form-control" name="Project" onChange={this.GetAssignTasks} > <option selected>Choose Project</option></select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label>Task</label>   :   <select id="TaskName" class="form-control" name="TaskName" onChange={this.CheckTaskName}  > <option selected>Choose Task</option></select>
                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld1" /> :     <input type="text" class="form-control" id="d1" onChange={this.IsNumber} name="d1" />

                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld2" /> :     <input type="text" class="form-control" id="d2" onChange={this.IsNumber} name="d2" />

                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld3" /> :     <input type="text" class="form-control" id="d3" onChange={this.IsNumber} name="d3" />

                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld4" /> :     <input type="text" class="form-control" id="d4" onChange={this.IsNumber} name="d4" />

                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-1">
                                    <label id="lbld5" /> :     <input type="text" class="form-control" id="d5" onChange={this.IsNumber} name="d5" />

                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld6" /> :     <input type="text" class="form-control" id="d6" onChange={this.IsNumber} name="d6" />

                                </div>
                                <div class="form-group col-md-1">
                                    <label id="lbld7" /> :     <input type="text" class="form-control" id="d7" onChange={this.IsNumber} name="d7" />

                                </div>
                            </div>

                            <div class="form-group col-md-3">
                                <input type="button" onClick={this.handleSubmit} class="btn btn-success btn-r-10" id="CreateTs" value={localStorage["Create"]} />&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="button" onClick={this.ResetForm} class="btn btn-danger btn-r-10" id="CancelTs" value="Cancel" />&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>

                        </div>


                    </div>

                </form>
                <div id="wrapper">


                    <div className="clear_fix"></div>
                    <div class="col-md-12">

                        <div id="TimesheetGrid" ></div>

                    </div>
                    <div>
                    </div>
                </div>
            </div>

        );
    }
}


export default TimeSheetGrid;

