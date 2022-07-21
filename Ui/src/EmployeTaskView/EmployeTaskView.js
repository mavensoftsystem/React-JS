import React from "react";
import './EmployeTaskView.css';
import { Grid, h } from "gridjs";
import base_url from '../Config';

class EmployeTaskView extends React.Component {
  constructor(props) {
    super(props);
    const initialState = {
      EmpTaskLists: [],
      EmpTsListsAll: [],
      Status: '',
      Comments: '',
      AllStatus: true,
      NotStartStatus: false,
      InProStatus: false,
      CompStatus: false
    }
    this.state = initialState;
    this.GridData = this.GridData.bind(this);
    this.getEmpTsList = this.getEmpTsList.bind(this);
    this.FormatDate = this.FormatDate.bind(this);
    let mygrid = '';
  }
  componentDidMount = async () => {
    
    this.GridData();
  }

  async updateEmpTsGrid() {
    const EmpTsGrid = document.getElementById('EmployeTaskViewData');
    var Pagenum = localStorage['PageNumber'];
    var empTsList = [];
    empTsList = await this.getEmpTsList();
    if (EmpTsGrid.childNodes.length !== 0) {
      if (Pagenum > 1) {
        setTimeout(() => {
          this.mygrid.updateConfig({
            search: true,
            data: empTsList,
            pagination: {
              enabled: true,
              limit: 5,
            },
          }).forceRender(document.getElementById("EmployeTaskViewData"));
        }, 2000);
      }
      else {
        setTimeout(() => {
          this.mygrid.updateConfig({
            search: true,
            data: empTsList,
            pagination: {
              enabled: true,
              limit: 5,
            },
          }).forceRender(document.getElementById("EmployeTaskViewData"));
        }, 2000);
      }
    }
  }
  async getEmpTsList() {
    const response = await fetch(base_url + "GetEmployeeTasksList", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        E_ID: localStorage['E_ID'],
      }),
    });
    if (response.status === 200) {
      let EmployeTaskData = [];
      EmployeTaskData = await response.json();
      for (var i = 0; i < EmployeTaskData.length; i++) {
        var Assign_Date = this.FormatDate(EmployeTaskData[i]['Task_Created_Date']);
        EmployeTaskData[i]['Task_Created_Date'] = Assign_Date
      }
      return EmployeTaskData;
    }
  }
  // grid
  async GridData() {
    document.getElementById("show").style.visibility = 'hidden';
    var EmpTaskData = await this.getEmpTsList();
    const EmpTaskGrid = document.getElementById('EmployeTaskViewData');
    if (EmpTaskGrid.childNodes.length === 0) {
      this.mygrid = new Grid({
        columns: [
          {
            id: 'Task_ID', name: 'Task_ID', hidden: 'true'
          },
          {
            id: 'Task_Created_Date', name: 'Assign Date'
          },
          {
            id: 'Proj_Name', name: 'Project Name'
          },
          {
            id: 'Task_Priority', name: 'Priority'
          },
          {
            id: 'Task_Desc', name: 'Task Details'

          },
          {
            id: 'Task_Status', name: 'Status'
          },
          {
            id: 'Comments', name: 'Comments', hidden: 'true'
          },
          
          {
            name: 'Action',
            formatter: (cell, row) => {
              return h('button', {
                className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600 btn btn-success',
                onClick: () => {
                  let EmployeeTaskArray = [];
                  let count = `${row.cells.length}`;
                  let i = 0;
                  while (count > 0) {
                    EmployeeTaskArray[i] = `${row.cells[i].data}`;
                    i++;
                    count--;
                  }
                  this.EditColumn(EmployeeTaskArray);
                }
              }, 'View');
            }
          },
        ],
        style: {
          table: {
              'border': '3px solid #ccc',

          },
          th: {
              'background-color': '#044981',
              'color': '#fff',
              'border-bottom': '5px solid #ccc',
              'text-align': 'center'
          },
          td: {
              'text-align': 'left',
              'padding': '2px',
              'border': '2.5px solid #ccc'

          }
      },
        search: {
          enabled: true,
        },
        //sort: true,
        data: EmpTaskData,
        pagination: {
          enabled: true,
          limit: 5,
          summary: true
        }
      }).render(document.getElementById("EmployeTaskViewData"));
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
  //edit
  EditColumn = async (EmployeeTaskArray) => {
   
    document.getElementById("show").style.visibility = 'visible';
    document.getElementById("txtdate").focus();
    localStorage['Task_ID'] = EmployeeTaskArray[0];
    var date = new Date(EmployeeTaskArray[1]);
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
    await this.setState({ TaskID: EmployeeTaskArray[0] });
    document.getElementById("txtpname").value = EmployeeTaskArray[2];
    document.getElementById("txtpri").value = EmployeeTaskArray[3];
    document.getElementById("txtdet").value = EmployeeTaskArray[4];
    let comm = EmployeeTaskArray[6];
    if (comm == 'null') {
      document.getElementById("txtcom").value = '';
    }
    else {
      document.getElementById("txtcom").value = EmployeeTaskArray[6];
    }
  
    var Status = EmployeeTaskArray[5];
    var option = document.getElementById('status').options;
    if (Status === 'In Progress') {
      this.setState({
        CompStatus: false,
        AllStatus: false,
        NotStartStatus: false,
        InProStatus: true
      })
    }
    else if (Status === 'Not Started' && Status !== 'Select Status') {
      this.setState({
        CompStatus: false,
        AllStatus: false,
        NotStartStatus: true,
        InProStatus: false
      })
    }
    else if (Status == 'Completed') {
      this.setState({
        CompStatus: true,
        AllStatus: false,
        NotStartStatus: false,
        InProStatus: false
      })
    }

  }

  //to change values in txtbox
  valueChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  //update grid
  handleSubmit = async () => {
    var Comments = document.getElementById('txtcom');
    var status = document.getElementById('status');
    const response = await fetch(base_url + "EmpTaskStatusComments", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Task_ID: localStorage['Task_ID'],
        Comments: Comments.value,
        Task_Status: status.value,
      }),
    });

    if (response.status === 200) {
      const bodyo = await response.text();
      if (bodyo === 'Success') {
        alert("Status Updated");
        this.handleCancel();
        this.updateEmpTsGrid();
      }
    }
  }


  //for cancel btn
  handleCancel = async () => {
    document.getElementById("show").style.visibility = "hidden";
  }

  render() {
    return (
      <div id="wrapper" >
        <div>
          <div class="col-md-12"><h3 style={{backgroundColor:'#044981',borderRadius:'5px',fontSize:"25px", color: '#fff'}}>My Tasks</h3></div>
          <div>
            <div class="col-md-12">
              <div id="EmployeTaskViewData"></div>
              <br></br><br></br>
            </div>
          </div>
        </div>
        <form id="show">
          <div>
            <div class="form-row">
              <div className='form-group col-md-4'>
                Assign Date :<input type="date" className="form-control" id='txtdate' name='startdate' readOnly={true} />
              </div>
              <div class="form-group col-md-4" >
                Project Name : <input class="form-control" type="text" id='txtpname' name="projectname" placeholder="Project Name" readOnly={true} />
              </div>
              <div class="form-group col-md-4">
                Priority : <input class="form-control" type="text" id='txtpri' name="priority" placeholder="Priority" readOnly={true} />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                Task Details : <textarea id='txtdet' name="Task Details" cols="40" rows="5" placeholder='Enter Task Details' class="form-control" readOnly={true} ></textarea>
              </div>
              <div class="form-group col-md-6">
                Comments : <textarea id='txtcom' name="Comments" cols="40" rows="5" onChange={this.valueChange} placeholder='Enter Your Comments' class="form-control"></textarea>
              </div>
            </div>
            {this.state.AllStatus ?
              <>
                <div class="form-group col-md-4">
                  Status: <select id="status" onChange={this.valueChange} class="form-control" name="Status">
                    <option selected hidden>Select Status</option>
                    <option>Completed</option>
                    <option>In Progress</option>
                    <option>Not Started</option>
                  </select>
                </div>
              </> : <></>

            }

            {this.state.NotStartStatus ?
              <>
                <div class="form-group col-md-4">
                  Status: <select id="status" onChange={this.valueChange} class="form-control" name="Status">
                    <option>Not Started</option>
                    <option>In Progress</option>
                  </select>
                </div>
              </> : <></>

            }

            {this.state.InProStatus ?
              <>
                <div class="form-group col-md-4">
                  Status: <select id="status" onChange={this.valueChange} class="form-control" name="Status">
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </> : <></>
            }
            {this.state.CompStatus ?
              <>
                <div class="form-group col-md-4">
                  Status: <select id="status" onChange={this.valueChange} class="form-control" name="Status">
                    <option>Completed</option>
                  </select>
                </div>
              </> : <></>
            }

            <div class="form-group col-md-12">
              <input type="button" name="Update" id='btnupd' className="btn btn-primary" onClick={this.handleSubmit} value="Update" />&nbsp;&nbsp;&nbsp;
              <input type="button" name="Cancel" id='btncan' className="btn btn-danger" onClick={this.handleCancel} value="Cancel" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default EmployeTaskView;