import '../TaskCreate/TaskCreate.css'
import React from 'react'
import $ from 'jquery';
import base_url from '../Config';
import "gridjs/dist/theme/mermaid.css";
import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
class TaskCreate extends React.Component {

    constructor(props) {
        super(props);
        const initialState = {
            ToDay: '',
            Max_Date:'',
            TaskName: '',
            Emp_Names: '',
            Project_Id: '',
            TaskType: '',
            TaskDescription: '',
            Priority: '',
            CompleteBy: '',
            TaskCreatedAt: '',
            Task_Updated_Date: '',
            STATUS: '',
            IsActive: '',
            ProjectsList: [],
            TaskList: [],
            TaskID: '',
            ValidOrNot: '',
            UpdateGrid: '',
            Efforts: '',
            FromDate: [],
            ToDate: [],
        }
        this.state = initialState;
        this.EditTask = this.EditTask.bind(this);
        this.ResetForm = this.ResetForm.bind(this);

        this.GetTasks = this.GetTasks.bind(this);
        this.CheckValidations = this.CheckValidations.bind(this);

        this.FilterTasks = this.FilterTasks.bind(this);
        this.IsNumber = this.IsNumber.bind(this);

        this.OnDateChange = this.OnDateChange.bind(this);
        this.ReadOnlyDate = this.ReadOnlyDate.bind(this);
        this.onlyAlphabets = this.onlyAlphabets.bind(this);
        this.ChangeStatus=this.ChangeStatus.bind(this);
        this.updateTaskFilterGrid=this.updateTaskFilterGrid.bind(this);

    }

    componentDidMount() {
         
        var NOW_date = new Date();
       var MaxDate=new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        var ToDay_Date = this.FormatDate(NOW_date);
        var MAX_Year = this.FormatDate(MaxDate);
        this.setState({ ToDay: ToDay_Date });
       this.setState({ Max_Date: MAX_Year });
        localStorage["Create"] = "Create";
        this.GetProjects();
        document.getElementById('Project').focus();
        this.TasksGrid();
        document.getElementById("CreateTask").style.visibility = 'visible';

    }
    componentDidUpdate() {

    }
    async UpdateTaskGrid() {
        
        var Pagenum= $(".gridjs-currentPage").text();
        const taskgrid = document.getElementById('taskgrid');
        if (taskgrid.childNodes.length !== 0) {
            if (Pagenum > 1) {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.TaskList,
                        pagination: {
                            enabled: true,
                            limit: 5,
                            page: Pagenum - 1,
                        },

                    }).forceRender(document.getElementById("taskgrid"));
                }, 2000);
            }
            else {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        search: true,
                        data: this.state.TaskList,
                        pagination: {
                            enabled: true,
                            limit: 5,
                        },

                    }).forceRender(document.getElementById("taskgrid"));
                }, 2000);
            }

        }

    }

    async ResetForm() {
        this.setState({ TaskName: '' });
        this.setState({ Efforts: '' });
        document.getElementById("Efforts").value = "";
        localStorage["Create"] = "Create";

        localStorage['TsC_TaskID'] = '';

        await this.setState({ TaskID: "" });
        document.getElementById("CreateTask").style.visibility = 'visible';
        for (var option of document.getElementById('Project').options) {
            if (option.value === 'Choose Project') { option.selected = 'true'; }
        }
        for (var option of document.getElementById('TaskType').options) {
            if (option.value === 'Choose Task Type') { option.selected = 'true'; }
        }
        document.getElementById("TaskName").value = "";
        document.getElementById("TaskDescription").value = "";
        document.getElementById("CompleteBy").value = "";
        for (var option of document.getElementById('Priority').options) {
            if (option.value === 'Choose Priority') { option.selected = 'true'; }
        }


    }

    async EditTask(TaskRowArray) {
        localStorage["Create"] = "Update";
      
        localStorage['TsC_TaskID'] = TaskRowArray[0];
        await this.setState({ TaskID: TaskRowArray[0] });
      
        document.getElementById("TaskName").value = TaskRowArray[2];
        for (var option of document.getElementById('Project').options) {
            if (option.value !== 'Choose Project' && option.label !== '') {
                if (TaskRowArray[5].includes(option.label) === true) {
                    option.selected = 'true';
                    break;
                }
            }

        }

        for (var Ttype of document.getElementById('TaskType').options) {
            if (Ttype.value !== 'Choose Task Type') {
                if (TaskRowArray[4].includes(Ttype.label) === true) {
                    Ttype.selected = 'true';
                    break;
                }
            }

        }

        document.getElementById("TaskDescription").value = TaskRowArray[3];
        document.getElementById('Efforts').value = TaskRowArray[7];
        this.setState({ Efforts: TaskRowArray[7] });
        for (var option of document.getElementById('Priority').options) {

            if (option.value !== 'Choose Priority') {
                if (TaskRowArray[8].includes(option.label) === true) {
                    option.selected = 'true';
                    break;
                }
            }

        }
        var TS_ComDate = new Date(TaskRowArray[6]);
      
        var year = TS_ComDate.getFullYear();
        var month = TS_ComDate.getMonth() + 1;
        var d1 = TS_ComDate.getDate();
        if (d1 < 10) {
            d1 = "0" + d1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var TS_ComDate1 = year + "-" + month + "-" + d1;

        document.getElementById("CompleteBy").value = TS_ComDate1;
        document.getElementById('Project').focus();

    }
    async TasksGrid() {
        this.GetTasks();
        const taskgrid = document.getElementById('taskgrid');
        if (taskgrid.childNodes.length === 0) {
            this.mygrid = new Grid({
                columns: [

                    {
                        id: 'Task_ID', name: 'Task Id ', hidden: 'true'
                    },
                    {
                        id: 'Task_Created_Date', name: 'Created At'
                    },
                    {
                        id: 'Task_Name', name: 'Task Name'
                    },
                    {
                        id: 'Task_Desc', name: 'Task Description'
                    },
                    {
                        id: 'Task_Type', name: 'Task Type'
                    },
                    {
                        id: 'Proj_Name', name: 'Project Name'
                    },

                    {
                        id: 'Task_comp_date', name: 'Complete By'

                    },
                    {
                        id: 'Task_Working_Hours', name: 'EST'
                    },
                    {
                        id: 'Task_Priority', name: 'Priority'
                    },
                    {
                        id: 'Task_Status', name: 'Task_Status', hidden: true
                    },
                    {
                        name: 'Edit',
                        formatter: (cell, row, Page) => {
                            return h('button', {
                                className: 'btn btn-success',
                                onClick: () => {
                                    let TaskRowArray = []; let i = 0;
                                    if (`${row.cells[9].data}` === "Not Started") {
                                        let count = `${row.cells.length}`;
                                        while (count > 0) {
                                            TaskRowArray[i] = `${row.cells[i].data}`;
                                            i++;
                                            count--;
                                        };
                                         this.EditTask(TaskRowArray);
                                    }
                                    else if (`${row.cells[9].data}` === "Closed") {
                                        alert("Task is Already Closed , Not Allowed to Edit");

                                    }
                                    else if (`${row.cells[9].data}` === "In Progress") {
                                        alert("Task is In Progress , Not Allowed to Edit");

                                    }
                                    else if (`${row.cells[9].data}` === "Completed") {
                                        alert("Task is Already Completed , Not Allowed to Edit");

                                    }



                                }
                            }, 'Edit');


                        }

                    },
                    {
                        name: 'Delete',
                        formatter: (cell, row, Page) => {
                            return h('button', {
                                className: 'btn btn-danger',
                                onClick: () => {
                                    if (`${row.cells[9].data}` === "Not Started") {
                                        let TaskId = `${row.cells[0].data}`;
                                        let TaskName = `${row.cells[2].data}`;
                                        if (window.confirm(`Do you want to delete the Task ? : ${TaskName}`)) {
                                            this.DeleteTask(TaskId);
                                        }
                                        else {}
                                    }
                                    else if (`${row.cells[9].data}` === "Closed") {
                                        alert("Task is Already Closed , Not Allowed to Delete");

                                    }
                                    else if (`${row.cells[9].data}` === "In Progress") {
                                        alert("Task is In Progress , Not Allowed to Delete");

                                    }
                                    else if (`${row.cells[9].data}` === "Completed") {
                                        alert("Task is Already Completed , Not Allowed to Delete");

                                    }


                                }
                            }, 'Delete');
                        }
                    },

                ],

                language: {
                    'search': {
                        'placeholder': '🔍 Search...'
                    },

                },

                data: () => {
                    return new Promise(resolve => {
                        setTimeout(() =>
                            resolve(this.state.TaskList), 2000);
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

                search: {
                    enabled: true
                },

                resizable: true,
                pagination: {
                    enabled: true,
                    limit: 5,
                    page: 0,
                    resetPageonUpdate: false
                   
                },
            })
                .render(document.getElementById("taskgrid"));
        } else {

        }
    }

    //Get Projects
    async GetProjects() {
        const response = await fetch(base_url + "GetProjectsLists")
        const ProjData = await response.json();
        var project = document.getElementById('Project');
        project.innerHTML = "";
        project.innerHTML = project.innerHTML + '<option value="Choose Project"> Choose Project </option>';
        for (var i = 0; i < ProjData.length; i++) {
            project.innerHTML = project.innerHTML +
                '<option value="' + ProjData[i]['P_ID'] + '">' + ProjData[i]['Proj_Name'] + '</option>';
        }

    }

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
    //TaskSListGrid
    async GetTasks() {
        const response = await fetch(base_url + "GetTasks")
        if (response.status === 200) {
            let TasksData = [];
            TasksData = await response.json();
            for (var i = 0; i < TasksData.length; i++) {
                var comp_date = this.FormatDate(TasksData[i]['Task_comp_date'])
                TasksData[i]['Task_comp_date'] = comp_date;
                var Created_Date = this.FormatDate(TasksData[i]['Task_Created_Date'])
                TasksData[i]['Task_Created_Date'] = Created_Date;
            }
            await this.setState({ TaskList: TasksData });
        }
    }


    async DeleteTask(TaskId) {
        const response = await fetch(base_url + "DeleteTask", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                TaskID: TaskId

            }),
        });
        if (response.status === 200) {
            const body = await response.text();

            if (body === 'Success') {
                alert("Task Deleted Successfully");
                this.setState({ UpdateGrid: 'Yes' });
                localStorage['UpdateGrid'] = 'Yes';
                this.ResetForm();
                this.GetTasks();
                this.UpdateTaskGrid();
            }
            else {
                alert('Task Delete Fail');
            }
        }
        else if (response.status === 400) {
            alert("Sorry for Inconvience It is a Server Error , Please Contact System Admin to Resolve this Issue");
        }

    }

    onlyAlphabets(e, t) {
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
        var tname = document.getElementById('TaskName');
        if (charCode == 32 && tname.value.length == 0) {
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
    IsNumber(e) {
        var Efforts = e.target.value;

        if (Efforts[0] == 0) {
            e.preventDefault();
        }
        else if (!isNaN(Efforts) && Math.round(Efforts) !== Efforts) {
            if (e.target.value <= 12.0) {
                e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
                this.setState({ Efforts: e.target.value });
            }
            else {
                e.target.value = e.target.value.slice(0, e.target.value.length - 1);

                alert('You can not enter more than 12 hours');
            }
        }
        else {
            alert('Only Numbers and Float will be Allowed');
        }


    }
    async CheckValidations() {
        var project = document.getElementById('Project');
        var TaskType = document.getElementById('TaskType');
        var TaskName = document.getElementById('TaskName');
        var TaskDescription = document.getElementById('TaskDescription');
        var Priority = document.getElementById('Priority');
        var Efforts = document.getElementById('Efforts');
        var CompleteBy1 = document.getElementById('CompleteBy');
        var CompleteBy1Date = new Date(CompleteBy1.value);
        var Today=new Date(this.state.ToDay);
        Today.setDate(new Date().getDate() - 1);
        var MaxDate=new Date(this.state.Max_Date);
        MaxDate.setDate(new Date().getDate() + 1);
        
        
        if (project.value === 'Choose Project' || project.value === '') {
            alert('Please Choose Project');
            project.focus();
        }
        else if (TaskType.value === 'Choose Task Type' || TaskType.value === '') {
            alert('Please Choose Task Type');
            TaskType.focus();
        }
        else if (Priority.value === "Choose Priority" || Priority === "Choose Priority") {
            alert('Please Choose Priority');
            Priority.focus();
        }
        else if (TaskName.value === '') {
            alert('Please Enter Task Name');
            TaskName.focus();
        }
        else if (TaskDescription.value === "") {
            alert('Please Enter Task Details.');
            TaskDescription.focus();
        }
       
       
        else if (CompleteBy1.value === "") {
            alert('Please Choose CompletedBy Date');
            CompleteBy1.focus();
        }
        else if (CompleteBy1Date <=Today) {
            alert('CompletedBy Date Should Be Today or Greater than Today');
            CompleteBy1.focus();
        }
        else if (CompleteBy1Date >=MaxDate) {
            alert('CompletedBy Date Should Be Less than '+' '+MaxDate.toLocaleDateString('en-US'));
            CompleteBy1.focus();
        }
        else if (Efforts.value === '') {
            alert('Please Enter EST Efforts');
            Efforts.focus();
        }
       

        else {
            
            localStorage['TsC_ValidOrNot'] = 'Yes';
            localStorage['TsC_Project_Id'] = project.value;
            localStorage['TsC_TaskType'] = TaskType.value;
            localStorage['TsC_TaskName'] = TaskName.value;
            localStorage['TsC_TaskDescription'] = TaskDescription.value;
            localStorage['TsC_Priority'] = Priority.value;
            localStorage['TsC_CompleteBy'] = CompleteBy1.value;
            await this.setState({ Efforts: Efforts.value })

        }
    }

    //TaskCreate and Task Update
    handleSubmit = async (event) => {
        localStorage['TsC_ValidOrNot'] = '';
        this.CheckValidations();
        if (localStorage['TsC_ValidOrNot'] === 'Yes') {
            var currentdate = new Date();
            var CurrentLongDate = currentdate.getFullYear() + "-"
                + (currentdate.getMonth() + 1) + "-"
                + currentdate.getDate() + " "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

            if (this.state.TaskID === '') {
                await this.setState({ IsActive: 'Yes' });
                await this.setState({ STATUS: 'Not Started' });


                const response = await fetch(base_url + "TaskCreate", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        Task_Name: localStorage['TsC_TaskName'],
                        Task_Desc: localStorage['TsC_TaskDescription'],
                        Task_Type: localStorage['TsC_TaskType'],
                        Proj_ID: localStorage['TsC_Project_Id'],
                        Task_comp_date: localStorage['TsC_CompleteBy'],
                        Task_Priority: localStorage['TsC_Priority'],
                        Is_Active: 'Yes',
                        Task_Status: 'Not Started',
                        Task_Created_Date: CurrentLongDate,
                        Task_Working_Hours: this.state.Efforts,

                    }),
                });
                if (response.status === 200) {
                    const body = await response.text();

                    if (body === 'Success') {
                        alert("Task Created Successfully");
                        this.ResetForm();
                        this.GetTasks();
                        this.UpdateTaskGrid();
                    }
                    else {
                        alert('Task Creation is Failed');
                    }
                }
                else if (response.status === 400) {
                    alert("Task Creation Server Error");
                }



            }
            else {
                const response = await fetch(base_url + "UpdateTask", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({
                        Task_ID: localStorage['TsC_TaskID'],
                        Proj_ID: localStorage['TsC_Project_Id'],
                        Task_Name: localStorage['TsC_TaskName'],
                        Task_Desc: localStorage['TsC_TaskDescription'],
                        Task_comp_date: localStorage['TsC_CompleteBy'],
                        Task_Priority: localStorage['TsC_Priority'],
                        Task_Type: localStorage['TsC_TaskType'],
                        Task_Updated_Date: CurrentLongDate,
                        Task_Working_Hours: this.state.Efforts,




                    }),
                });
                if (response.status === 200) {
                    const body = await response.text();

                    if (body === 'Success') {
                        alert("Task Updated Successfully");
                        this.setState({ UpdateGrid: 'Yes' });
                        localStorage['UpdateGrid'] = 'Yes';
                        this.ResetForm();
                        this.GetTasks();
                        this.UpdateTaskGrid();
                    }
                    else {
                        alert('Task Update Fail, Contact System Admin');
                    }
                }
                else if (response.status === 400) {
                    alert("Server Error Contact System Admin");
                }
            }
        }


    }

    ReadOnlyDate(readDate) {
        var R1 = [];
        R1[0] = readDate.getFullYear();
        R1[1] = readDate.getMonth() + 1;
        R1[2] = readDate.getDate()
        return R1;
    }
    OnDateChange = async (event) => {

        if (event.target.name === 'CompleteBy') {
            
            var key = event.keyCode;
            var currentdate = new Date();
            var d1 = new Date(event.target.value);
            currentdate = this.ReadOnlyDate(currentdate);
            var CompleteBy = this.ReadOnlyDate(d1);
            if (CompleteBy[0] == currentdate[0]) {
                if (CompleteBy[1] == currentdate[1]) {
                    if (CompleteBy[2] >= currentdate[2]) { }
                    else {
                        alert('CompleteBy Date Not Less than Today');
                        event.target.value = "";
                    }
                }
                else if (CompleteBy[1] > currentdate[1]) { }
                else {
                    alert('CompleteBy Date Not Less than Today');
                    event.target.value = "";
                }
            }
            else if (CompleteBy[0] > currentdate[0]) { }
            else {
                alert('CompleteBy Date Not Less than Today');
                event.target.value = "";
            }


        }
        if (event.target.name === 'FromDate') {
            var currentdate = new Date();
            var d1 = new Date(event.target.value);
            currentdate = this.ReadOnlyDate(currentdate);
            var FromDate = this.ReadOnlyDate(d1);
            this.setState({ FromDate: FromDate });
            if (FromDate[0] <= currentdate[0]) {
                if (FromDate[1] > currentdate[1]) {
                    alert('From Date Not greater than Today');
                    event.target.value = "";
                }
                else if (FromDate[1] === currentdate[1]) {
                    if (FromDate[2] > currentdate[2]) {
                        alert('From Date Not greater than Today');
                        event.target.value = "";
                    }
                }

            }
            else {
                alert('From Date Not greater than Today');
                event.target.value = "";
            }


        }
        if (event.target.name === 'ToDate') {
            FromDate = document.getElementById('fromDate');
            if (FromDate.value === '') {
                alert('Please Select From Date');
                event.target.value = "";
                FromDate.focus();
            }
            else {
                d1 = new Date(event.target.value);
                if (this.state.FromDate.length !== 0) {
                    currentdate = this.state.FromDate;
                }

                var ToDate = this.ReadOnlyDate(d1);
                localStorage['ToDate'] = ToDate;
                
                if (ToDate[0] < currentdate[0]) {
                    alert('To Date Must be Greater than FromDate');
                    event.target.value = "";
                }
                else if (ToDate[0] === currentdate[0]) {

                    if (ToDate[1] < currentdate[1]) {
                        alert('To Date  Must be Greater than FromDate');
                        event.target.value = "";
                    }
                    else if (ToDate[1] === currentdate[1]) {
                        if (ToDate[2] < currentdate[2]) {
                            alert('To Date Must be Greater than FromDate');
                            event.target.value = "";
                        }
                    }


                }
            }



        }

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
    FilterTasks() {
        var FromDate = document.getElementById('fromDate');
        var ToDate = document.getElementById('toDate');
        if (FromDate.value === '') {
            alert('Please Select From Date');
            FromDate.focus();
        }
        else if (ToDate.value === '') {
            alert('Please Select To Date');
            ToDate.focus();
        }
        else {
            localStorage['DateFilter'] = true;
            let TArray = this.state.TaskList;
            var TArray2 = [];
            for (var i = 0; i < TArray.length; i++) {
                var currentdate = new Date(TArray[i]['Task_Created_Date']);
                var month = currentdate.getMonth() + 1;
                var date = currentdate.getDate();
                if (date < 10) {
                    date = '0' + date;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                var datetime = currentdate.getFullYear() + "-"
                    + month + "-" + date;
               
                if (datetime >= FromDate.value && datetime <= ToDate.value) {
                    TArray2.push(TArray[i]);
                }

            }
          
            this.updateTaskFilterGrid(TArray2);
            
        }

    }

    updateTaskFilterGrid(dataList)
    {
        setTimeout(() => {
            this.mygrid.updateConfig({
                search: true,
                data: dataList,
                pagination: {
                    enabled: true,
                    limit: 5,

                },

            }).forceRender(document.getElementById("taskgrid"));
        }, 2000);
    }
    TaskStatusFilter(Status) {
        
        var Ts_List = this.state.TaskList
        var New_Ts_List = [];
        var j = 0, i = 0;
        if (Status === "All" ) {
           
            return Ts_List;
        }
        else if (Status === "Not Started" || Status === "In Progress" ||Status==="Completed"  ) {
            for (i = 0; i < Ts_List.length; i++) {
                if (Ts_List[i]['Task_Status'] === Status) {
                    New_Ts_List[j] = Ts_List[i];
                    j++;
                }
            }
         
            return New_Ts_List;
        }
      
       

    } 
    ChangeStatus()
    {
        var TS_Status = document.getElementById('Status');
        if (TS_Status.value !== 'Choose Status') {
            if (TS_Status.value === 'All') 
            {
                this.UpdateTaskGrid();
            }
            else {
                var TsList =  this.TaskStatusFilter(TS_Status.value);
                this.updateTaskFilterGrid(TsList);
            }
           
        }
    }
    render() {

        return (
            <div>
                <form >
                    <style></style>
                    <div id="wrapper">
                        <div class="col-md-12"><h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Create Task</h3></div>
                        <div class="form-row">
                            <div class="form-group col-md-4">
                                Project  :   <select id="Project" class="form-control" name="Project_Id"   > <option selected>Choose Project</option></select>
                            </div>
                            <div class="form-group col-md-4">
                                Task Type  :   <select id="TaskType" class="form-control" name="TaskType" >
                                    <option selected>Choose Task Type</option>
                                    <option> Development</option>
                                    <option> Bug Fixing</option>

                                </select>
                            </div>
                            <div class="form-group col-md-4">
                                Priority  :   <select id="Priority" class="form-control" name="Priority"  >
                                    <option selected>Choose Priority</option>
                                    <option> High</option>
                                    <option> Medium</option>
                                    <option> Low</option>
                                </select>
                            </div>
                          
                        </div>


                        <div class="form-row">
                        <div class="form-group col-md-12">
                                Task Name  :    <textarea name="TaskName" id="TaskName" maxLength={100} autocomplete="off"   placeholder="Enter Task Name"  class="form-control" ></textarea>
                            </div>
                            <div class="form-group col-md-12">
                                Task Details  :    <textarea id="TaskDescription" name="TaskDescription" maxLength={500} onChange={this.handleChange} cols="40" rows="5" placeholder='Enter Task Details' class="form-control" ></textarea>

                            </div>

                            

                            <div class="form-group col-md-4">
                                Completed By  :    <input type="date" class="form-control" id="CompleteBy" min={this.state.ToDay} max={this.state.Max_Date} name="CompleteBy" />

                            </div>
                        </div>

                        <div class="form-row">

                            <div class="form-group col-md-4">
                                EST Efforts :   <input name="Efforts" id="Efforts" value={this.state.Efforts} placeholder="Enter EST Efforts" maxLength={4} onChange={this.IsNumber} class="form-control" type="text" />

                            </div>
                            <div class="form-group col-md-4">
                                <div></div>
                                <input type="button" onClick={this.handleSubmit} class="btn btn-success btn-r-10" id="CreateTask" value={localStorage["Create"]} />&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="button" onClick={this.ResetForm} class="btn btn-danger btn-r-10" id="CancelTask" value="Cancel" />&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>

                        </div>

                    </div>


                </form>



                <div id="wrapper">
                    <div class="col-md-12"><h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Total Tasks </h3></div>
                    <div>
                        <div class="form-horizontal">
                        <div class="form-row col-md-2">
                            Status :
                            <select id="Status" class="form-control" name="Status" onChange={this.ChangeStatus}  >
                                    <option selected>Choose Status</option>
                                    <option> All</option>
                                    <option> Not Started</option>
                                    <option> In Progress</option>
                                    <option> Completed</option>
                                </select>
                           </div>
                        <div class="form-row col-md-2">
                            From Date:
                            <input type="date" id="fromDate" name="FromDate" max={this.state.ToDay} class="form-control datepicker" data-date-format="dd/mm/yyyy" onChange={this.OnDateChange} />
                        </div>
                        <div class="form-row col-md-2">
                        To Date:                            
                            <input type="date" id="toDate" name="ToDate" class="form-control" data-date-format="dd/mm/yyyy" onChange={this.OnDateChange} />
                        </div>                               
                        <div class="form-row col-md-3">
                            <input type="button" onClick={this.FilterTasks} class="btn btn-success" id="SearchTasks2" value='Go' />  
                        </div>
                           
                        </div>
                    </div>
                    <div className="clear_fix"></div>
                    <div class="col-md-12">

                        <div id="taskgrid" class="TasksGrid"></div>

                    </div>
                    <div>

                    </div>
                </div>
            </div>



        );
    }
}


export default TaskCreate;

