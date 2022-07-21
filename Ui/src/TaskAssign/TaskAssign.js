import React, { PureComponent } from 'react';
import { Grid, h } from "gridjs";
import $ from 'jquery';
import "gridjs/dist/theme/mermaid.css";
import base_url from '../Config';

class TaskAssign extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      Emp_Id: '',
      Task_Id: '',
      EmployeeList: [],
      ProjectsList: [],
      TasksList: [],
      EmpList: [],
      TaID: '',
      Task_ID: '',
      Proj_ID: '',
      employee: '',
      E_id: '',
      UpdateGrid: '',


    }
   
    
   }
  componentDidMount() {
    localStorage["Assign"] = "Assign";
    localStorage['PageNumber']="";
    this.project();
    this.Getemployee();
    this.GetTaskGrid();
  
    localStorage['TA_ID'] = '';
  }

  handleChange = (event) => {

    this.setState({ [event.target.name]: event.target.value });
  }
  ResetForm=()=> {

    localStorage["Assign"] = "Assign";
    localStorage['TA_ID'] = '';
    document.getElementById("Project").value = "Select Project";
    document.getElementById("task").value = "Select Task";
    document.getElementById("employee").value = "Select Employee";
    var Tname=document.getElementById("task")
    var i, L = Tname.options.length - 1;
    for (i = L; i >= 0; i--) {
        
        if (Tname[i].value !== 'Select Task') {
            Tname.remove(i);
        }

    }
    for (var option of document.getElementById('project').options) {
      if (option.label === 'Select Project') { option.selected = 'true'; }
    }
    for (var option of document.getElementById('task').options) {
      if (option.label === 'Select Task') { option.selected = 'true'; }
    }
    for (var option of document.getElementById('employee').options) {
      if (option.label === 'Select Employee') { option.selected = 'true'; }
    }

  }

  submitChange = async (event) => {
    event.preventDefault();
    var selectedEmployee = '';
    for (var option of document.getElementById('employee').options) {
      if (option.selected) {
        selectedEmployee = option.value;
      }
    }
    var selectedtask = '';
    for (var option of document.getElementById('task').options) {
      if (option.selected) {
        selectedtask = option.value;
        localStorage['Task_id'] = selectedtask;
      }
    }
    var Project = '';
    for (var option of document.getElementById('Project').options) {
      if (option.selected) {
        Project = option.value;
        localStorage['project'] = Project;
      }
    }
    var current = new Date();
    var date = `${current.getMonth() + 1}/${current.getDate()}/${current.getFullYear()}`;
    localStorage['date'] = date;
    if (Project === '' || Project.trim() === 'Select Project') {
      alert('Select Project');
    }
    else if (selectedtask === '' || selectedtask.trim() === 'Select Task') {
      alert('Select Task');
    }
    else if (selectedEmployee === '' || selectedEmployee.trim() === 'Select Employee') {
      alert('Select Employee');
    }
    
    if (localStorage['TA_ID'] === '') {

      const response = await fetch(base_url + "TaskAssign", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          Proj_ID: Project,
          Task_ID: selectedtask,
          E_id: selectedEmployee,
          Create_At: date,
        }),
      });
      if (response.status === 200) {
        const result = await response.text();
        if (result === 'Success') {
          alert('Task Assigned Succesfully');

          this.UpdateGrid();
           this.project();
         
           var Tname=document.getElementById("task")
    var i, L = Tname.options.length - 1;
    for (i = L; i >= 0; i--) {
        
        if (Tname[i].value !== 'Select Task') {
            Tname.remove(i);
        }

    }
       
          document.getElementById('employee').value = "Select Employee";
          document.getElementById('task').value = "Select Task";
          
          document.getElementById('Project').value = "Select Project";
         
        }
        else {
       
        }
      }
    }
    else {
      var status
      const response = await fetch(base_url + "UpdateAssignTask", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          Proj_ID: Project,
          Task_id: selectedtask,
          Emp_ID: selectedEmployee,
          TA_ID: localStorage['TA_ID'],
          Create_At: date,
        }),
      });
      if (response.status === 200) {
        const body = await response.json();
      
        var status = body;
        if (body === status) {
          if (body[0].Task_Status === 'Not Started') {
            alert("Task  Updated");
          }
          else if ((body[0].Task_Status === 'In Progress')) {
            alert("Task Is Already In Progress");
          }
          else if ((body[0].Task_Status === 'Closed')) {
            alert("Task Is Already Completed");
          }

          this.ResetForm();


          this.UpdateGrid();
        }
        else {
          alert(' Taskassign Update Fail');
        }
      }
    }
  }

   project=async()=> {
  

    const response = await fetch(base_url + "AssignTasksList")
    const ProjData = await response.json();

    var project = document.getElementById('Project');
    var i, L = project.options.length - 1;
    for (i = L; i >= 1; i--) {
      project.remove(i);
    }
    for (var i = 0; i < ProjData.length; i++) {

      project.innerHTML = project.innerHTML +
        '<option value="' + ProjData[i]['P_ID'] + '">' + ProjData[i]['Proj_Name'] + '</option>';
    }

  }
   GetTasks=async()=> {
   
    const response = await fetch(base_url + "GetTasksListIds", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Project_id: document.getElementById('Project').value,
      }),
    });
    const result = await response.json();
    var tasks = document.getElementById('task');
    var i, L = tasks.options.length - 1;
    for (i = L; i >= 0; i--) {
      tasks.remove(i);
    }
    tasks.innerHTML += '<option value="Select Task">Select Task</option>';
    for (var i = 0; i < result.length; i++) {
      tasks.innerHTML = tasks.innerHTML +
        '<option value="' + result[i]['Task_ID'] + '">' + result[i]['Task_Name'] + '</option>';
    }
    
  }
   Getemployee=async()=> {
    const response = await fetch(base_url + "Getemployees")
    const EmpData = await response.json();
    this.setState({ EmpList: EmpData });
    let EmpArray = [];
    EmpArray = this.state.EmpList;
    localStorage['E_id'] = EmpArray[0];
    var emp = document.getElementById('employee');
    for (var i = 0; i < EmpArray.length; i++) {
      emp.innerHTML = emp.innerHTML +
        '<option value="' + EmpArray[i]['E_ID'] + '">' + EmpData[i]['First_Name'] + " " + EmpArray[i]['Last_Name'] + '</option>';
    }
  }
   deleteChange=async(TaId)=> {
     
    var answer = window.confirm("Want To Delete?");
    if (answer) {

      const response = await fetch(base_url + "DeleteTaskAssign", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          TA_ID: TaId

        }),


      });

      if (response.status === 200) {
        const body = await response.json();
        if (body == "") {
          alert("Deleted Successfully");
          this.setState({ UpdateGrid: 'Yes' });
          localStorage['UpdateGrid'] = 'Yes';
          this.project();
          this.UpdateGrid();
        }
        var status = body;
        if (body === status) {

          if ((body[0].Task_Status === 'In Progress')) {
            alert("Task Is Already In Progress");
          }
          else if ((body[0].Task_Status === 'Closed')) {
            alert("Task Is Already Completed");

          } else if ((body[0].Task_Status === 'Completed')) {
            alert("Task Is Already Completed");
          }
        
          this.setState({ UpdateGrid: 'Yes' });
          localStorage['UpdateGrid'] = 'Yes';
          this.UpdateGrid();
        }

        else {
          alert(' Task Delete Fail');
        }
      }
      else if (response.status === 400) {
        alert("Error");
      }

    } else {
      alert("not deleted")
    }
 
  }
  //TaskSGrid
   GetTaskGrid=async()=> {
    
    const response = await fetch(base_url + "GetTaskAssign")
    if (response.status === 200) {
      let TaskData = [];
      TaskData = await response.json();
      for (var i = 0; i < TaskData.length; i++) {
        var Assign_Date = this.FormatDate(TaskData[i]['Create_At']);
        TaskData[i]['Create_At'] = Assign_Date
      }
      await this.setState({ TAsksList: TaskData });
      const griddata = document.getElementById('TaskGridData');

      if (griddata.childNodes.length === 0) {
       
        this.mygrid = new Grid({

          columns: [

            {
              id: 'TA_ID', name: 'TaId ', hidden: 'true'
            },
            {
              id: 'Create_At', name: 'Assign_date'
            },
            {
              id: 'First_Name', name: 'Emp Name '
            },
            {
              id: 'Proj_Name', name: 'Project'
            },
            {
              id: 'Task_Name', name: 'Task'
            },
            {
              id: 'Emp_ID', name: 'Emp_ID', hidden: 'true'
            },
            {
              name: 'Edit',
              formatter: (cell, row) => {
                return h('button', {

                  className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600 btn btn-success',
                  onClick: () => {
                    let TaskRowArray = [];
                    let count = `${row.cells.length}`;
                    let i = 0;
                    while (count > 0) {
                      TaskRowArray[i] = `${row.cells[i].data}`;
                      i++;
                      count--;
                    }

                    // this.EditAssignTask(TaskRowArray)
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
                    let TaId = `${row.cells[0].data}`;
                    let Task_Name = `${row.cells[1].data}`;
                    localStorage['TaId'] = TaId;
                    localStorage['Task_Name'] = Task_Name;
                    var pagenumber = $(".gridjs-currentPage").text();                                  
                    localStorage['PageNumber'] = pagenumber;   
                    // localStorage['TaId'] = TaId;
                    this.deleteChange(TaId);
                  
                  }
                }, 'Delete');
              }
            },
          ],
          data: TaskData,
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
          // sort: true,
          search: {
            enabled: true
          },
          pagination: {
            enabled: true,
            limit: 5,
            summary: true
          },
        }).render(document.getElementById("TaskGridData"));
      };
    }
  }


   UpdateGrid=async() =>{

    const TAskGridData = document.getElementById('TaskGridData');
    this.GetTaskGrid();
    var Pagenum = localStorage[1];
    if (TAskGridData.childNodes.length !== 0) {

      if (Pagenum > 1) {
        setTimeout(() => {
          this.mygrid.updateConfig({
            search: true,
            data: this.state.TAsksList,
            pagination: {
              enabled: true,
              limit: 5,
              page: Pagenum - 1,
            },

          }).forceRender(document.getElementById("TaskGridData"));
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.mygrid.updateConfig({
            search: true,
            data: this.state.TAsksList,
            pagination: {
              enabled: true,
              limit: 5,
            },

          }).forceRender(document.getElementById("TaskGridData"));
        }, 1000);
      }

    }

  }


   EditAssignTask=async(TaskRowArray)=> {
    localStorage["Assign"] = "Update";
    localStorage['TA_ID'] = TaskRowArray[0];
    localStorage['First_Name'] = TaskRowArray[2];
    localStorage['Proj_Name'] = TaskRowArray[3];
    localStorage['Task_Name'] = TaskRowArray[4];
    await this.setState({ TaId: TaskRowArray[0] });
    var ename = TaskRowArray[2];
    var eid = TaskRowArray[5];
    for (var option of document.getElementById('employee').options) {
      if (option.label !== 'Select Employee') {
        if (eid.includes(option.value) === true) {
          option.selected = 'true';
          break;
        }
      }
    }
    var Project = TaskRowArray[3];
    for (var option of document.getElementById('Project').options) {
      if (option.value !== 'Select Project') {
        if (Project.includes(option.label) === true) {
          option.selected = 'true';
        }
      }
    }
    var Task = TaskRowArray[4];
    for (var option of document.getElementById('task').options) {
      if (option.value !== 'Select Task') {
        if (Task.includes(option.label) === true) {
          option.selected = 'true';
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
  render() {
    return (
      <div id="wrapper">
        <div class="col-md-12">
              <h3 style={{ backgroundColor: '#044981', borderRadius: '5px', fontSize: "25px", color: '#fff' }}>Assign Task </h3>
            </div>
        <form id="taskas" onSubmit={this.submitChange}>
         
         <div class="form-row">
              <div class="form-group col-md-4">
                <label> Project Name:</label>
              
                <select id="Project" class="form-control" name="project" onChange={this.GetTasks}  >
                  <option selected >Select Project</option>
                </select>
              </div>
           
              <div class="form-group col-md-4">
                <label > Task Name:</label>
             
                <select id="task" class="form-control" name="Task_Id" 
                onChange={this.handleChange} 
                  >
                  <option selected>Select Task</option>
                </select>
            </div>
            
              <div class="form-group col-md-4">
                <label>Employee Name:</label>
             
                <select id="employee" class="form-control" name="Emp_Id" 
                onChange={this.handleChange}  
                >
                  <option selected>Select Employee</option></select>
              </div>
            
            </div>
           <div class="form-row">
             
              <div class="form-group col-md-3">
                <input type="button" onClick={this.submitChange} name="submit" className="btn btn-success" value={localStorage["Assign"]} id="bt-taskassign" />&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="button" onClick={this.ResetForm} class="btn btn-danger btn-r-10" id="CancelTas" value="Cancel" />
              </div>
            </div>
         

        </form>
        <div  >
          {/* <div class="col-lg-2"></div> */}
          <div class="col-lg-12" id="TaskGridData" ></div>
        </div>
      </div>
    
    )
  }
}
export default TaskAssign;