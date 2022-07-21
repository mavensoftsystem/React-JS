import React, { Component } from 'react'
import base_url from '../Config';
import { Grid, h } from "gridjs";
import '../EmployeesReport/Employeereport.css';

export default class Employeereport extends Component {
    constructor(props){
        super(props)
        this.state={
             employeeList:[],
             EmpList:[],
             EmployeeReportList:[],
             TaskReports_Emp:[],
             FromDate:'',
             ToDate:''
        }
          this.FilterTasks = this.FilterTasks.bind(this);
          this.EmployeesFilter=this.EmployeesFilter.bind(this);
          this.UpdateGrid=this.UpdateGrid.bind(this);
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    componentDidMount(){
        localStorage['PageNumber']="";
        this.GetEmployees();
        this.GetEmployeeReportList();
        this.ReadGrid();
        
        // localStorage['TaskReportLists'] = '';
    }

    async GetEmployees() {
         
        const response = await fetch(base_url+"GetEmployeeLists")
        console.log("response" + response);
        const Empdata = await response.json();
        this.setState({ employeeList: Empdata });
        console.log(this.state.employeeList);
        let employeeListArray = [];
        employeeListArray = this.state.employeeList;
        var Employee = document.getElementById('employee');
        for (var i = 0; i < employeeListArray.length; i++) {
            
        Employee.innerHTML = Employee.innerHTML +
            '<option value= "' +Empdata[i]["Emp_ID"]+ '">' + Empdata[i]['First_Name'] + " " + Empdata[i]['Last_Name'] + '</option>';
        }
    }   
      async UpdateGrid(TaskReportsArray) {
        var Data1=TaskReportsArray;
        const griddata = document.getElementById('EmployeesGridData');
       var Pagenum=localStorage['PageNumber'];
        if (griddata.childNodes.length !== 0) {
            if(Pagenum>1)
            {
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        
                        data: Data1,
                        pagination: {
                            enabled: true,                   
                            limit: 5,
                            page:Pagenum-1,
    
                            //resetPageOnUpdate :true,
                        },
                    }).forceRender(document.getElementById("EmployeesGridData"));
                }, 2000);
            }
            else{
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        //data:  this.state.TaskReportList,
                        data:  this.state.EmployeeReportList,
                        pagination: {
                            enabled: true,                   
                            limit: 5,
                            //resetPageOnUpdate :true,
                        },
                    }).forceRender(document.getElementById("EmployeesGridData"));
                }, 2000);
            }
        }
    }
    async GetEmployeeReportList() {
                
            const response = await fetch(base_url+"GetEmployeeReportList")
            if (response.status === 200) {
            console.log("response" + response);
            let TasksReport = [];
            TasksReport = await response.json();
            for (var i = 0; i < TasksReport.length; i++) {
            var DOJ = this.FormatDate(TasksReport[i]['DOJ'])
            TasksReport[i]['DOJ'] = DOJ;
            }
            console.log('TaskData' + TasksReport);
            localStorage['EmployeeReportList'] = TasksReport;
            await this.setState({ EmployeeReportList: TasksReport });
        }
    };
    ReadOnlyDate(readDate) {
        var R1 = [];
        R1[0] = readDate.getFullYear();
        R1[1] = readDate.getMonth() + 1;
        R1[2] = readDate.getDate()
        return R1;
    }
    
    OnDateChange = async (event) => {

        FromDate = document.getElementById('fromDate');
        ToDate = document.getElementById('toDate');
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
                    alert('To Date Not Lower than FromDate');
                    event.target.value = "";
                }
                else if (ToDate[0] === currentdate[0]) {

                    if (ToDate[1] < currentdate[1]) {
                        alert('To Date Not Lower than FromDate');
                        event.target.value = "";
                    }
                    else if (ToDate[1] === currentdate[1]) {
                        if (ToDate[2] < currentdate[2]) {
                            alert('To Date Not Lower than FromDate');
                            event.target.value = "";
                        }
                    }
                }
            }
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
    async ReadGrid() {
        
        this.GetEmployeeReportList();
        const griddata = document.getElementById('EmployeesGridData');
        if (griddata.childNodes.length === 0) {
         console.log('✅ Element is empty');
                this.mygrid = new Grid({
                    columns: [
                        {
                            id: 's.no', name:  's.no', hidden: 'true'
                        },
                        {
                            id: 'Emp_ID', name: 'Employee Number'
                        },
                        {
                            id: 'Employee_Name', name: 'Employee Name'
                        },
                        {
                            id: 'Email_ID', name: 'Email Id'
                        },
                        {
                            id: 'Contact_Num', name: 'Phone number'
                        },
                        {
                            id: 'DOJ', name: 'Date Of Joining'
                        },
                    ],
                    data: this.state.EmployeeReportList,
                    data: () => {
                    return new Promise(resolve => {
                    setTimeout(() =>
                   resolve(this.state.EmployeeReportList), 2000);
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
                   //  data: EmployeesData,
                    resizable: true,
                    pagination: {
                    enabled: true,
                    limit: 5,
                    page:0,
                    resetPageonUpdate: false   
                    }
                })
                .render(document.getElementById("EmployeesGridData"));
            } else {
                console.log('⛔️ Element is NOT empty');
                 setTimeout(() => {
                    // lets update the config
                 this.mygrid.updateConfig({
                 data: this.state.EmployeeReportList,
                      })
                    .forceRender(document.getElementById("EmployeesGridData"));
                  }, 2000);
            }
        }
        EmployeesFilter()
        {
           //  
            var TaskReports_EmpList=[];
            var Emp=document.getElementById('employee');
            
            if(Emp.value!=="Select Employee" && Emp.value!=="All")
            {
                var TaskReports=this.state.EmployeeReportList;
             
                for(var i=0;i<TaskReports.length;i++)
                {
                  if(TaskReports[i]['Emp_ID']=== Emp.value)
                    {
                      TaskReports_EmpList.push(TaskReports[i]);
                    }
                }
                this.setState({ TaskReports_Emp: TaskReports_EmpList });
                this.UpdateGrid(TaskReports_EmpList);
            }
         
            else{
              TaskReports_EmpList=this.state.EmployeeReportList;
            }  
        }
        FilterTasks() {
           //  
            var Emp=document.getElementById('employee')
            var FromDate = document.getElementById('fromDate');
            var ToDate = document.getElementById('toDate');
            if (Emp.value === 'Select Employee') {
                alert('Please Select Employee ');
                Emp.focus();
            }
            else if (FromDate.value === '') {
                alert('Please Select From Date');
                FromDate.focus();
            }
            else if (ToDate.value === '') {
                alert('Please Select To Date');
                ToDate.focus();
            }
            else {
                //alert('validation');
                 
                localStorage['DateFilter'] = true;
                var Emp=document.getElementById('employee')
                let TArray = this.state.EmployeeReportList;
                let Array1=this.state.TaskReports_Emp;
                var TArray2 = [];
                console.log('From Date ' + FromDate.Value);
                console.log('To Date ' + ToDate.Value);
                if(Emp.value==="Select Employee" || Emp.value==="All"){
                for (var i = 0; i < TArray.length; i++) {
                        var currentdate = new Date(TArray[i]['DOJ']);
                        var month = currentdate.getMonth() + 1;
                        var date = currentdate.getDate();
                        if (date < 10) {
                            date = '0' + date;
                        }
                        if (month < 10) {
                            month = '0' + month;
                        }
                        var datetime = currentdate.getFullYear() + "-"+ month + "-" + date;
                        if (datetime >= FromDate.value && datetime <= ToDate.value) {
                            TArray2.push(TArray[i]);
                        }
                        console.log('Tarry2 ::' + TArray2);
                    }}
                       else{
                             for (var i = 0; i < Array1.length; i++) {
                            var currentdate = new Date(Array1[i]['DOJ']);
                            var month = currentdate.getMonth() + 1;
                            var date = currentdate.getDate();
                            if (date < 10) {
                                date = '0' + date;
                            }
                            if (month < 10) {
                                month = '0' + month;
                            }
                            var datetime = currentdate.getFullYear() + "-"+ month + "-" + date;
                            if (datetime >= FromDate.value && datetime <= ToDate.value) {
                                TArray2.push(Array1[i]);
                            }
                             console.log('Tarry2 ::' + TArray2);
                    }
                }
                    setTimeout(() => {
                    this.mygrid.updateConfig({
                    data: TArray2,
                    pagination: {
                    enabled: true,
                    limit:5,
                    page:0,
                   },
    
                    }).forceRender(document.getElementById("EmployeesGridData"));
                }, 2000);
            }
        }    
    // This function is used to get data into table
    render(){
        return(
            <div id = "wrapper">
                <form>                                     
                    <div class="col-md-12">  <h3 class="main_hedg" style={{backgroundColor:'#044981',borderRadius:'5px',fontSize:"25px", color: '#fff'}} >Employee Report</h3></div>
                      <div class="col-md-12"> 
                        <div class="form-group col-md-3"> 
                         Employee : 
                                    <select id="employee" class="form-control" name="Employee_Name"
                                     onClick={this.EmployeesFilter}
                                     >
                                    <option selected>Select Employee</option>
                                    <option select>All</option>
                                </select>
                        </div>
                        <div class="form-group col-md-2">                                  
                        Role:   
                            <select id="role" class="form-control"name="Role_Name"  >
                                  <option selected>Select Role</option>
                                    <option select>All</option>
                                    <option select>Manager</option>
                                    <option select>Employee</option>
                                </select>
                            </div>
                        
                        <div class="form-row col-md-2">
                        From Date:
                                 <input type="date" id="fromDate" name="FromDate"
                                 class="form-control datepicker" data-date-format="dd/mm/yyyy" onChange={this.OnDateChange} 
                                  />
                        </div>
                        <div class="form-row col-md-2">
                        To Date:                            
                            <input type="date" id="toDate" name="ToDate"
                            class="form-control datepicker" data-date-format="dd/mm/yyyy" onChange={this.OnDateChange}/>
                        </div>                           
                        <div class="form-row col-md-2">
                            <input type="button" onClick={this.FilterTasks} class="btn btn-success" id="SearchTasks2" value='Go' />  
                        </div>
                        </div>
                </form><br></br>
                <div class="col-md-12">
                    <h3 > Employees Details </h3>
                    <div id = 'EmployeesGridData'></div>
                            </div>  
                     </div>                                            
                     
    )};
}       
    
    
        
