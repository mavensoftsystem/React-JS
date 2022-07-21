import React, { Component } from 'react'
import { Grid, h } from "gridjs";
import base_url from '../Config';
import '../ProjectsReport/Projectreport.css';
export default class Projectreport extends Component {
           constructor(props){
           super(props)
           this.state={
            projectList:[],
            ProjectReportList:[],
            ProjectReports:[],
            FromDate:'',
            ToDate:''
        }  
    }
        componentDidMount(){
            localStorage['PageNumber']="";
            this.GetProjectReportList();
            this.ReadGrid();
            this.GetProjects();
        }    
        async GetProjects() {
             
            const response = await fetch(base_url+"GetProjectsLists")
            console.log("response" + response);
            const Projectdata = await response.json();
            this.setState({ ProjectList: Projectdata });
            let ProjectListArray = [];
            ProjectListArray = this.state.ProjectList;
            var Project = document.getElementById('project');
            var i, L = Project.options.length - 1;
            for (i = L; i >= 2; i--) {
                Project.remove(i);
            }    
            for (var i = 0; i < ProjectListArray.length; i++) {
                Project.innerHTML = Project.innerHTML +
                '<option value="' + ProjectListArray[i]['Proj_Name'] + '">' + ProjectListArray[i]['Proj_Name'] + '</option>';
            }
        }
        UpdateGrid=async(TaskReportsArray)=> {
            var Data1=TaskReportsArray;
            const griddata = document.getElementById('GridData');
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
              }).forceRender(document.getElementById("GridData"));
                }, 2000);
                  }
                    else{
                        setTimeout(() => {
                        this.mygrid.updateConfig({
                            data: Data1,
                            pagination: {
                            enabled: true,                   
                            limit: 5,
                                //resetPageOnUpdate :true,
                            },
                        }).forceRender(document.getElementById("GridData"));
                    }, 2000);
                }
            }
        }
        async GetProjectReportList() {
                   
            const response = await fetch(base_url+"GetProjectReportList")
            if (response.status === 200) {
            console.log("response" + response);
            let TasksReport = [];
            TasksReport = await response.json();
            for (var i = 0; i < TasksReport.length; i++) {
            var Proj_Start_Date = this.FormatDate(TasksReport[i]['Proj_Start_Date'])
            TasksReport[i]['Proj_Start_Date'] = Proj_Start_Date;
            }
             console.log('TaskData' + TasksReport);
             localStorage['ProjectReportList'] = TasksReport;
             await this.setState({ ProjectReportList: TasksReport });
                
            }
        };
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
            var OnlyDate = currentdate.getFullYear() + "-"  + month + "-" + date;
            return OnlyDate;
        }
        ReadGrid=async()=> {
           //  
            this.GetProjects();
                const griddata = document.getElementById('GridData');
                if (griddata.childNodes.length === 0) {
                    console.log('✅ Element is empty');
                    this.mygrid = new Grid({
                        columns: [
                         
                            {
                                id: 'Proj_Name', name: 'Project Name'
                            },
                            {
                                id: 'Proj_Domain', name: 'Domain'
                            },
                            {
                                id: 'Proj_Start_Date', name: 'Start Date'
                            },
                            
                        ],
                            data: this.state.ProjectReportList,                           
                             data: () => {
                            return new Promise(resolve => {
                                setTimeout(() =>
                                    resolve(this.state.ProjectReportList), 1000);
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
                        page:0,
                        resetPageonUpdate: false
                        },
                    })
                    .render(document.getElementById("GridData"));
                } else {
                    console.log('⛔️ Element is NOT empty');
                    setTimeout(() => {
                        // lets update the config
                        this.mygrid.updateConfig({
    
                              data: this.state.ProjectReportList,
                          })
                        .forceRender(document.getElementById("GridData"));
                      }, 2000);
        }
        }
        ProjectsFilter=()=>{
             
            var ProjectReports_List=[];
            var Project=document.getElementById('project');
            
            if(Project.value!=="Select Project" && Project.value!=="All")
            {
                var TaskReports=this.state.ProjectReportList;
                for(var i=0;i<TaskReports.length;i++)
                {
                    if(TaskReports[i]['Proj_Name']=== Project.value)
                    {
                        ProjectReports_List.push(TaskReports[i]);
                    }
                }
                this.setState({ ProjectReports: ProjectReports_List });   
            }     
            else{
                ProjectReports_List=this.state.ProjectReportList;
            }
            this.UpdateGrid(ProjectReports_List); 
        }
        FilterTasks=()=> {
           //  
            var FromDate = document.getElementById('fromDate');
            var ToDate = document.getElementById('toDate');
            var Project=document.getElementById('project');
            if(Project.value  ==='Select Project'){
                alert("Please Select Project");
                Project.focus();
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
                var Project=document.getElementById('project');
                let TArray = this.state.ProjectReportList;
                let Array1=this.state.ProjectReports;
                var TArray2 = [];
                console.log('From Date ' + FromDate.Value);
                console.log('To Date ' + ToDate.Value);
                if(Project.value==="Select Project"  || Project.value==="All" ){
                    
                    for (var i = 0; i < TArray.length; i++) {
                   
                        var currentdate = new Date(TArray[i]['Proj_Start_Date']);
                        var month = currentdate.getMonth() + 1;
                        var date = currentdate.getDate();
                        if (date < 10) {
                            date = '0' + date;
                        }
                        if (month < 10) {
                            month = '0' + month;
                        }
                        var datetime = currentdate.getFullYear() + "-"+ month + "-" + date;
                        console.log(datetime);
                        if (datetime >= FromDate.value && datetime <= ToDate.value) {
                             TArray2.push(TArray[i]);
                         }
                        console.log('Tarry2 ::' + TArray2);
                    }}
                    else{
                        for (var i = 0; i < Array1.length; i++) {
                   
                            var currentdate = new Date(Array1[i]['Proj_Start_Date']);
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
                          console.log('Tarry2 ::' + TArray2)    
                    }
                }
                setTimeout(() => {
                    this.mygrid.updateConfig({
                        data: TArray2,
                        pagination: {
                        enabled: true,
                        limit:5,
                        page:0,
                            //resetPageOnUpdate :true,
                        },
                    }).forceRender(document.getElementById("GridData"));
                }, 2000);
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
            
        render(){
            return(
                <div id = "wrapper">
                    <form>                                     
                        <div class="col-md-12">  <h3 class="main_hedg" style={{backgroundColor:'#044981',borderRadius:'5px',fontSize:"25px", color: '#fff'}}> Project Report</h3>
                        </div>
                            <div class="col-md-12"> 
                            <div class="form-row col-md-5">                             
                            Project:          
                            <select id="project" class="form-control" name="Project_Name" onClick={this.ProjectsFilter}>
                                    <option selected>Select Project</option>
                                    <option select>All</option>
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
                            <div class="form-group col-md-3">
                                <input type="button" onClick={this.FilterTasks} class="btn btn-success" id="SearchTasks2" value='Go' />  
                            </div>
                            </div>
                    </form><br></br>
                    <div class="col-md-12">
                        <div class="col-md-12">
                    <h3 >Project Lists</h3>
                            <div id = 'GridData'></div>
                            </div> 
                            </div>                                           
                        </div>                                                 
        )};
    }       
     
     
    
        