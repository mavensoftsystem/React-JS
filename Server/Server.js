const express = require('express');
var app = express();
const mssql = require('mssql');
const bodyparser = require('body-parser');
const cors = require("cors")
var nodemailer = require('nodemailer');
const expressPinoLogger = require('express-pino-logger');
const logger = require('./Logger/loggerService');
const loggerMidleware = expressPinoLogger({
  logger: logger,
  autoLogging: false,
});
app.use(loggerMidleware);
app.use(bodyparser.json());
app.use(cors());

var config = {
  user: 'abc',
  password: '********',
  server: '******',
 
  database: 'abcd',
  options: {
    "enableArithAbort": true,
    "encrypt": false
  }
};

mssql.connect(config, function (err) {
  if (!err) {
    console.log("Db Connection Succeed");
  }
  else {
    console.log("Db connect Failed \n Error :" + JSON.stringify(err, undefined, 2));
  }


});

app.listen(4100, () => console.log("Express server is running at port no : 4100"));



app.post('/Signin', (req, res) => {
  var request = new mssql.Request();

  request.query("select e.*,l.Password from Employee e join Login l on l.Login_ID=e.Login_ID where e.Email_ID='" + req.body.Email_ID + "' and l.Password='" + req.body.Password + "' "

    , function (err, recordset) {
      logger.info("Signin Was started")
      if (!err) {
        logger.debug("Signin Was successful")
        res.send(recordset['recordset']);
       
      }
      else {
        logger.error("Signin Wasn't successful: " + err)
      };
    });
});


app.put('/GetChangepassword', (req, res) => {
  var request = new mssql.Request();
  request.query("UPDATE Login SET Password='" + req.body.newpassword + "' WHERE Email_ID='" + req.body.email + "' and Password='" + req.body.currentpassword + "'",
    function (err, result, fields) {
      logger.info("GetChangepassword Was started")
      if (!err) {
        logger.debug("GetChangepassword Was successful")
        res.send(JSON.stringify(result));
      }else {
        logger.error("GetChangepassword Wasn't successful: " + err)
      };
    });

});

var transporter = nodemailer.createTransport({
 
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false
  },
  auth: {
    user: "****@gmail.com",
    
    pass: "***********"

  }
});


app.post('/CheckEmailPassword', (req, res) => {
  var email = req.body.email;
  var request = new mssql.Request();
  request.query("SELECT Email_ID FROM Login where Email_ID='" + email + "'",
    function (err, recordset) {
      logger.info("CheckEmailPassword Was started")
      if (!err) {
        res.send(recordset['recordset']);
        logger.debug("CheckEmailPassword Was successful")
      }
      else {
        logger.error("CheckEmailPassword Wasn't successful: " + err)
      }
    });
})

app.post('/ForgotPassword', (req, res) => {
  var email = req.body.email;
  var request = new mssql.Request();
  request.query("SELECT Password,Email_ID FROM Login where Email_ID='" + email + "'",
    function (err, recordset) {
      logger.info("ForgotPassword Was started")
      if (!err) {
        res.send(recordset);
        
        for (var i = 0; i < recordset.recordsets[0].length; i++) {
          let Obj = recordset.recordsets[0][i];

          mailOptions = {
            from: '"****@gmail.com"',
            to: Obj.Email_ID,
            subject: `Time Tracker Password Recovery`,
            html: "Your Password Is:" + Obj.Password,
          };

        }

        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            res.json({
              status: 'fail',
            });
          } else {
            console.log('== Message Sent for forgotpassword ==');
            logger.debug("ForgotPassword, Mail Was Sent to: "+email)
            res.json({
              status: 'success',
            });
            logger.debug("ForgotPassword Was successful")
          }
        });

      }else {
        logger.error("ForgotPassword Wasn't successful: " + err)
      }
    });
});

app.post('/GetProfile', (req, res) => {
  var request = new mssql.Request();
 
  request.query("select Emp_ID,First_Name,Last_Name,Email_ID,DOJ,Contact_Num from employee WHERE E_ID=" + req.body.E_ID + ""
    , function (err, recordset) {
      logger.info("GetProfile Was started")
    
      if (!err) {
        logger.debug("GetProfile Was successful")
        res.send(recordset['recordset']);
      }
      else {
        logger.error("GetProfile Wasn't successful: " + err)
      }
    });
})

app.post('/UpdateProfile', (req, res) => {
   
  var request = new mssql.Request();

  var edprofile = req.body;
  request.query("update Employee set First_Name='" + edprofile.First_Name + "',Last_Name='" + edprofile.Last_Name + "',Emp_Updated_Date=" + edprofile.Emp_Updated_Date + ",Contact_Num='" + edprofile.Contact_Num + "' where Email_id='" + req.body.Email + "'",
  
    function (err, recordset) {
      logger.info("UpdateProfile Was started")
      if (!err) {
        res.send("Success");

        res.send(recordset['recordset']);
        logger.debug("UpdateProfile Was successful")
      }

      else {
       
        res.send('Fail');
        logger.error("UpdateProfile Wasn't successful: " + err)
      }
    })
});



app.get('/GetTasks', (req, res) => {
  var request = new mssql.Request();
  request.query("SELECT ts.*, pr.Proj_Name as Proj_Name FROM Task ts join Projects pr on ts.Proj_ID=pr.P_ID and ts.Is_Active= 'Yes' order by Task_ID desc", function (err, recordset) {
  
   logger.info("GetTasks  Was started");
    if (!err) {
      res.send(recordset['recordset']);
      logger.debug("GetTasks  Was successful")
    }
    else {
      console.log('error' + err);
      logger.error("GetTasks  Wasn't successful: " + err)
    }

  });


})


app.post('/TaskCreate', (req, res) => {
  var request = new mssql.Request();
  var Task = req.body;

  request.query("INSERT INTO Task(Proj_ID,Task_Name,Task_Desc,Task_comp_date,Task_Priority," +
    "Task_Type,Task_Status,Task_Created_Date,Is_Active,Task_Working_Hours )" +
    "VALUES('" + Task.Proj_ID + "','" + Task.Task_Name + "','" + Task.Task_Desc + "','" + Task.Task_comp_date + "'," +
    " '" + Task.Task_Priority + "','" + Task.Task_Type + "','" + Task.Task_Status + "','" + Task.Task_Created_Date + "','" + Task.Is_Active + "','" + Task.Task_Working_Hours + "')"
    , function (err, result) {
      logger.info("TaskCreate  Was started")
      if (!err) {
        res.send('Success');
        logger.debug("TaskCreate  Was successful")
      }
      else {
        console.log('error' + err);
        logger.error("TaskCreate  Wasn't successful: " + err)
      }

    });
});



app.post('/DeleteTask', (req, res) => {

  var request = new mssql.Request();
  request.query("Update Task set Is_Active='No'  WHERE Task_ID=" + req.body.TaskID + " and Task_Status='Not Started' ",
    function (err, result) {
      logger.info("DeleteTask  Was started")
      if (!err) {

        res.send("Success");
        logger.debug("DeleteTask  Was successful")
      }
      else {

        res.send('Fail');
        console.log('error ::' + err);
        logger.error("DeleteTask Wasn't successful: " + err)
      }

    });
});

app.post('/UpdateTask', (req, res) => {
  var request = new mssql.Request();
  var Tasks = req.body;

  request.query("Update Task set Task_Name='" + Tasks.Task_Name + "',Task_Desc='" + Tasks.Task_Desc + "',Task_Type='" + Tasks.Task_Type + "',Proj_ID=" + Tasks.Proj_ID + ",Task_comp_date='" + Tasks.Task_comp_date + "',Task_Priority='" + Tasks.Task_Priority + "',Task_Working_Hours=" + Tasks.Task_Working_Hours + ",Task_Updated_Date='" + Tasks.Task_Updated_Date + "'  WHERE Task_ID=" + Tasks.Task_ID + " and Task_Status='Not Started' ",
    function (err, result) {

      logger.info("UpdateTask Was started")
      if (!err) {
        logger.debug("UpdateTask  Was successful")
        res.send("Success");
      }

      else {

        res.send('Fail');
       
        logger.error("UpdateTask Wasn't successful: " + err)
      }

    })
});


app.get('/GetProjectsLists', (req, res) => {

  var request = new mssql.Request();

  request.query("select * from Projects where IsActive like '%YES%' order by P_ID desc", function (err, recordset) {
    logger.info("GetProjectsLists Was started")
    if (!err) {
      logger.debug("GetProjectsLists Was successful")
      res.send(recordset['recordset']);
    }
    else {
      console.log('GetProjectList error' + err);
      logger.error("GetProjectsLists Wasn't successful: " + err)
    }
  });

});

app.post('/createproject', (req, res) => {
  var request = new mssql.Request();
  var Proj = req.body;

  request.query("INSERT INTO Projects(Proj_ID,Proj_Name,Proj_Domain,Proj_Desc,Proj_Start_Date,Proj_Created_Date,IsActive)VALUES('" + Proj.Proj_ID + "','" + Proj.Proj_Name + "','" + Proj.Proj_Domain + "','" + Proj.Proj_Desc + "','" + Proj.Proj_Start_Date + "','" + Proj.Proj_Created_Date + "','YES')"
    , function (err, result) {
      logger.info("createproject Was started")
      if (!err) {
        res.send('Success');

        logger.debug("createproject Was successful")
      }
      else {
        console.log('error' + err);
        logger.error("createproject Wasn't successful: " + err)
      }

    });
});

app.post('/UpdateProjects', (req, res) => {
  var request = new mssql.Request();
  var Projects = req.body;

  request.query("Update Projects set Proj_Name='" + Projects.Proj_Name + "',Proj_Domain='" + Projects.Proj_Domain + "',Proj_Desc='" + Projects.Proj_Desc + "',Proj_Start_Date='" + Projects.Proj_Start_Date + "',Proj_Updated_Date='" + Projects.Proj_Updated_Date + "'  WHERE P_ID=" + Projects.P_ID + " ",
    function (err, result) {
      logger.info("UpdateProjects Was started")
      if (!err) {
      
        logger.debug("UpdateProjects Was successful")
        res.send("Success");
      }

      else {
        logger.error("UpdateProjects Wasn't successful: " + err)
        res.send('Fail');

      }

    })
});


app.post('/DeleteProject', (req, res) => {
  var request = new mssql.Request();

  request.query("Update Projects set IsActive='No' where P_ID=" + req.body.P_ID + "",
    (err, rows, fields) => {
      logger.info("DeleteProject Was started")
      if (!err) {
        logger.debug("DeleteProject Was successful")
        res.send('Success');
      }
      else {

        res.send('Fail');
        logger.error("DeleteProject Wasn't successful: " + err)
      }
    });
});


app.get('/GetRoles', (req, res) => {
  var request = new mssql.Request();

  request.query('SELECT * FROM Roles', function (err, recordset) {
    logger.info("GetRoles api was started");
    if (!err) {
      res.send(recordset['recordset']);
      logger.debug("GetRoles api  Was successful");
    } else {
      res.send(err)

      logger.error("GetRoles api Wasn't successful: " + err);
    }
  });
});


app.get('/CheckEmp_ID', (req, res) => {

  var request = new mssql.Request();

  request.query('select * from Employee', function (err, recordset) {
    logger.info("CheckEmp_ID was started");
    if (!err) {
      logger.debug("CheckEmp_ID  Was successful");
      res.send(recordset['recordset']);
    }
    else {
      logger.error("CheckEmp_ID  Wasn't successful: " + err);
    }
  });

});


app.post('/Login', (req, res) => {
  var request = new mssql.Request();
  let emp = req.body;

  request.query("INSERT INTO Login(Email_ID,Password,Role_ID)" +
    "VALUES('" + emp.email + "','" + emp.password + "'," + emp.roleid + ")", function (err, result) {
      logger.info("Login api was started");
      if (!err) {
        res.send('Success');;
        logger.debug("Login  Was successful");
      }
      else {
        console.log('error in  Login', err);
        logger.error("Login Wasn't successful: " + err);
      }
    })
});

app.get('/GetLoginID', (req, res) => {
  var request = new mssql.Request();

  request.query(' select top 1 Login_ID from Login order by Login_ID desc', function (err, recordset) {
    logger.info("GetLoginID  was started");
    if (!err) {
      res.send(recordset['recordset']);
      logger.debug("GetLoginID   Was successful");
    } else {
      res.send(err)
      logger.error("GetLoginID Wasn't successful: " + err);
    }
  });
});


app.post('/CreateEmployee', (req, res) => {
  var request = new mssql.Request();
  let emp = req.body;
  request.query("INSERT INTO Employee(Emp_ID,First_Name,Last_Name,Email_ID,DOJ,Role_ID,Login_ID,Contact_Num)" +
    "VALUES('" + emp.empolyeeid + "','" + emp.firstname + "','" + emp.lastname + "','" + emp.email + "','" + emp.DOJ + "'," + emp.roleid + "," + emp.loginid + ",'" + emp.number + "')", function (err, result) {
      logger.info("CreateEmployee api was started");
      if (!err) {
        res.send('Success');
        logger.debug("CreateEmployee  Was successful");
      }
      else {
        logger.error("CreateEmployee api Wasn't successful: " + err);
      }
    });
});

app.post('/SendEMail', (req, res) => {
  var request = new mssql.Request();

 
  request.query("select e.Emp_ID,l.Password,e.Email_ID from employee e ,login l where l.login_id=e.Login_ID and l.Login_ID='" + req.body.loginid + "'", function (err, recordset) {
    logger.info("SendEMail was started");
    if (!err) {
      res.send(recordset);
      var Semail = recordset.recordsets[0]

      for (var i = 0; i < Semail.length; i++) {
        let Obj = recordset.recordsets[0][i];
        mailOptions = {
          from: '"****@gmail.com"',
          to: Obj.Email_ID,
          subject: `Account Creation`,

          // html: <html><body>`Congratulations, Welcome To Mavensoft.An Account Was Created For Daily Management Of Tasks.So,Check And Update Your Time Sheet By Logging in With DetailsURL:<a href='http://52.172.163.181:3000/'>http://52.172.163.181:3000/</a><b>EmployeeID:</b>{Obj.Emp_ID}<b>Email_ID:</b>{Obj.Email_ID}Password:{Obj.Password} </body></html>
          html: '<html>' +
          
          '<p>' +
          '<span style="color:#1e2d7d;font-weight:bold">' +
          "Congratulations," + '&nbsp;&nbsp;' +
          '</span>' + '<br>' +
          "Welcome To Company. " +
          '<br>' +
          "An Account Was Created For Daily Management Of Tasks."+
          '<br>' +
          
          '<span style="color:#044981;font-weight:bolder">' +
          "Your Login Credentials as below:" + '&nbsp;&nbsp;' +
          '</span>' +'<br>' +
       
          "URL:" + '<a href="https://www.mavensoft.com/">Tracker.com</a>'  +
          '<br>' +
          "Email:" + Obj.Email_ID +
          '<br>' +
          "Password:" + Obj.Password +
          '<br>' +
          "EmployeeID:" + Obj.Emp_ID +
          '<br><br><br>' +
          '</p>' +
          
          '</html>'
        };
      }

      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          res.json({
            status: 'fail',
          });
        } else {
          logger.info("Email was sent after creating employee to: "+Obj.Email_ID);
          res.json({
            
            status: 'success',
          });
          
        }
      });

    logger.debug("SendEMail  Was successful");
    
    }
    else {
      logger.error("SendEMail  Wasn't successful: " + err);
    }
  });
});

app.get('/GetEmployeesList', (req, res) => {
  var request = new mssql.Request();
  request.query("select e.E_ID,e.Emp_ID,e.First_Name,e.Last_Name,e.Email_ID,e.DOJ,e.Contact_Num,r.Role_Name,l.Password from Employee e, Roles r, Login l where r.Role_ID = e. Role_ID and e.IsACtive='YES' and l.Login_ID=e.Login_ID order by e.E_ID desc", function (err, recordset) {
    logger.info("GetEmployeesList was started");
    if (!err) {
      logger.debug("GetEmployeesList  Was successful");
      res.send(recordset['recordset']);
    }
    else {
      res.send('Fail');
      logger.error("GetEmployeesList  Wasn't successful: " + err);
    }

  });
});

app.post('/checkEmail', (req, res) => {
  var request = new mssql.Request();

  request.query("SELECT Email_ID FROM EMPLOYEE where Email_ID='" + req.body.email + "' ", function (err, recordset) {
    logger.info("checkEmail was started");
    if (!err) {
     
      res.send(recordset['recordset']);
      logger.debug("checkEmail  Was successful");
    } else {
      res.send(err)
      logger.error("checkEmail  Wasn't successful: " + err);
    }
  });
});

app.post('/UpdateEmployee', (req, res) => {
  var request = new mssql.Request();
  var emp = req.body;

  request.query("Update Employee SET Emp_ID='" + emp.empolyeeid + "',First_Name='" + emp.firstname + "',Last_Name='" + emp.lastname + "',Email_ID='" + emp.email + "',Role_ID=" + emp.roleid + ",DOJ='" + emp.DOJ + "',Emp_Updated_Date='" + emp.Employee_Updated_Date + "',Contact_Num='" + emp.number + "'  WHERE E_ID=" + emp.E_ID + " ",
    function (err, result) {
      logger.info("UpdateEmployee was started");
      if (!err) {
        logger.debug("UpdateEmployee  Was successful");
        res.send("Success");
      }

      else {
       
        res.send('Fail');
        logger.error("UpdateEmployee  Wasn't successful: " + err);
      }

    })
});

app.post('/GetLoginIDBy_Emp_ID', (req, res) => {
  var request = new mssql.Request();
  var emp = req.body;

  request.query("select  Login_ID from Employee where E_ID=" + emp.E_ID + "", function (err, recordset) {
    logger.info("GetLoginIDBy_Emp_ID was started");
    if (!err) {
      res.send(recordset['recordset']);
      logger.debug("GetLoginIDBy_Emp_ID  Was successful");
    } else {
      res.send(err)
       logger.error("GetLoginIDBy_Emp_ID  Wasn't successful: " + err);
    }
  });
})

app.put('/UpdateLogin', (req, res) => {
  var request = new mssql.Request();
  var emp = req.body;

  request.query("Update Login set Email_ID='" + emp.email + "',Password='" + emp.password + "',Role_ID=" + emp.roleid + ",Updated_Date='" + emp.Employee_Updated_Date + "'  WHERE Login_ID=" + emp.loginid + " ",
    function (err, recordset) {
      logger.info("UpdateLogin was started");
      if (!err) {
        logger.debug("UpdateLogin  Was successful");
        res.send("Success");
      }

      else {
        
        res.send('Fail');
        logger.error("UpdateLogin  Wasn't successful: " + err);
      }

    })
});


app.post('/DeleteEmployee', (req, res) => {
  var request = new mssql.Request();

  request.query("Update Employee set IsActive='No' where E_ID=" + req.body.E_ID + "",
    (err, recordset) => {
      logger.info("DeleteEmployee was started");
      if (!err) {
        logger.debug("DeleteEmployee  Was successful");
        res.send('Success');
      }
      else {

        res.send('Fail');
        logger.error("DeleteEmployee  Wasn't successful: " + err);
      }
    });
});

app.post("/GetEmployeeTasksList", async (req,res) =>{
  var request = new mssql.Request();
  request.query("select t.*,at.Create_At,p.Proj_Name  from Task t  join Assign_Task at on t.Task_ID=at.Task_ID and at.Emp_ID="+req.body.E_ID+" join Projects p on p.P_ID=t.Proj_ID where t.Is_Active='yes' order by t.Task_Created_Date desc;", function (err, recordset){
    logger.info("GetEmployeeTasksList was started");
    if (!err) {
      res.send(recordset['recordset']);
      logger.debug("GetEmployeeTasksList  Was successful");
      
    }
    else {
      logger.error("GetEmployeeTasksList  Wasn't successful: " + err);
    }
    });
});

app.post('/EmpTaskStatusComments', (req, res) => {
  var request = new mssql.Request();
  var Tasks = req.body;

  request.query("Update Task set Task_Status='" + Tasks.Task_Status + "',Comments='" + Tasks.Comments + "' where Task_ID=" + Tasks.Task_ID + ";", function (err, rows, fields) {
    logger.info("EmpTaskStatusComments was started");
    if (!err) {
      logger.debug("EmpTaskStatusComments  Was successful");
      res.send("Success");
    }
    else {
        res.send("Fail");
      logger.error("EmpTaskStatusComments  Wasn't successful: " + err);
    }
  })
});


app.get('/GetEmployeereportList', (req, res) => {

  var request = new mssql.Request();
  request.query("select e.Emp_ID, CONCAT(e.First_Name,' ',e.Last_Name) as Employee_Name,e.Email_ID,e.Contact_Num,e.DOJ ,r.Role_ID from employee e join roles r on r.role_id=e.role_id where r.role_name != 'manager'and  IsActive like '%YES%' order by doj desc", function (err, recordset) {
    logger.info("GetEmployeereportList was started");
    if (!err) {
      logger.debug("GetEmployeereportList  Was successful");
      res.send(recordset['recordset']);
    }
    else {
      logger.error("GetEmployeereportList  Wasn't successful: " + err);
    }
  });
});


app.get('/GetTaskAssign', (req, res) => {
  var request = new mssql.Request();

  request.query("select ta.TA_ID,ta.Emp_ID,e.First_Name,p.Proj_Name,t.Task_Name ,Create_At  from Assign_Task ta    join Task t on t.Task_ID=ta.Task_ID  join Projects p on p.P_ID=ta.Proj_ID   join Employee e on e.E_ID=ta.Emp_ID order by ta.TA_ID desc;",

    function (err, recordset) {
      logger.info("GetTaskAssign was started");
      if (!err) {
        logger.debug("GetTaskAssign  Was successful");
        res.send(recordset['recordset']);
      } else {
        logger.error("GetTaskAssign  Wasn't successful: " + err);
      }
    });
});


app.get('/Getemployees', (req, res) => {
  var request = new mssql.Request();
   request.query("select E_ID,Emp_ID,First_Name,Last_Name,Email_ID,DOJ,Contact_Num from employee where Role_ID=2 and IsActive='yes' "
    , function (err, recordset) {
      logger.info("Getemployees was started");
      if (!err) {
        logger.debug("Getemployees  Was successful");
        res.send(recordset['recordset']);
      } else {
        logger.error("Getemployees  Wasn't successful: " + err);
      }
    });
})

app.post('/TaskAssign', (req, res) => {
   
  var request = new mssql.Request();
  let taskassign = req.body;

  request.query("INSERT INTO Assign_Task(Proj_ID,Task_ID,Emp_ID,Create_At )" +
    "VALUES(" + taskassign.Proj_ID + "," + taskassign.Task_ID + "," + taskassign.E_id + ",'" + taskassign.Create_At + "')",
    (err, rows, fields) => {
      logger.info("taskassign was started");
      if (!err){
        res.send("Success");
        logger.debug("taskassign  Was successful");
      }else {
        res.send('Fail');
        logger.error("taskassign  Wasn't successful: " + err);
      }

    });
});


app.get('/AssignTasksList', (req, res) => {
  var request = new mssql.Request();
  request.query(" select distinct p.P_ID,p.Proj_Name from projects p join Task t on p.P_ID=t.proj_ID where t.Task_ID in( select  a.Task_ID from Assign_Task a left outer join Task b on a.Task_ID = b.Task_ID where b.Task_ID is null UNION ALL select a.Task_ID from Task a left outer join Assign_Task b on a.Task_ID = b.Task_ID where b.Task_ID is null  and a.Proj_ID in (P_ID)) "
    , function (err, recordset) {
      logger.info("AssignTasksList was started");
  
      if (!err) {
        logger.debug("AssignTasksList  Was successful");
        res.send(recordset['recordset']);
      }
      else {
        logger.error("AssignTasksList  Wasn't successful: " + err);
      }
    });
})


app.post('/GetTasksListIds', (req, res) => {
  var request = new mssql.Request();

  request.query("select a.Task_ID, b.Task_Name from Assign_Task a left outer join Task b on a.Task_ID = b.Task_ID where b.Task_ID is null UNION ALL select a.Task_ID, a.Task_Name from Task a left outer join Assign_Task b on a.Task_ID = b.Task_ID where b.Task_ID is null and a.Proj_ID=" + req.body.Project_id + "",
    function (err, recordset) {
      logger.info("GetTasksListIds was started");
    
      if (!err) {
        logger.debug("GetTasksListIds  Was successful");
        res.send(recordset['recordset']);
      }
      else {
        logger.error("GetTasksListIds  Wasn't successful: " + err);
      }
    });
});

app.post('/DeleteTaskAssign', (req, res) => {

  var request = new mssql.Request();
 
  request.query("DELETE a  FROM Assign_Task a  LEFT JOIN Task t ON a.Task_ID = t.Task_ID WHERE t.Task_Status='not started' and a.TA_ID=" + req.body.TA_ID + "   (select A.Task_Status from task A inner join Assign_Task B  on A.Task_ID=B.Task_ID where B.TA_ID = " + req.body.TA_ID + ")",
    function (err, recordset) {
      logger.info("DeleteTaskAssign was started");
    
      if (!err) {
        logger.debug("DeleteTaskAssign  Was successful");
        res.send(recordset['recordset']);
      }
      else {
        logger.error("DeleteTaskAssign  Wasn't successful: " + err);
      }
    });
});


app.post('/UpdateAssignTask', (req, res) => {

  var request = new mssql.Request();

  var tasks = req.body;

  request.query("UPDATE Assign_Task SET Proj_ID=CASE WHEN A.Task_Status='Not Started' THEN " + tasks.Proj_ID + " ELSE B.Proj_ID END,Task_ID=CASE WHEN A.Task_Status='Not Started' THEN " + tasks.Task_id + " ELSE B.Task_ID END,Emp_ID= CASE  WHEN A.Task_Status='Not Started' THEN " + tasks.Emp_ID + " ELSE B.Emp_ID END ,Create_At= CASE  WHEN A.Task_Status='Not Started' THEN '" + tasks.Create_At + "' ELSE B.Create_At END FROM Task A inner join Assign_Task B on A.Task_ID=B.Task_ID  WHERE TA_ID= " + tasks.TA_ID + " (select A.Task_Status from task A inner join Assign_Task B  on A.Task_ID=B.Task_ID where B.TA_ID= " + tasks.TA_ID + " )",
    function (err, recordset) {
      logger.info("UpdateAssignTask was started");
    
      if (!err) {
        logger.debug("UpdateAssignTask  Was successful");
        res.send(recordset['recordset']);
      }
      else {
        logger.error("UpdateAssignTask  Wasn't successful: " + err);
      }
    });
});


app.post('/GetAssignProjTasks', (req, res) => {
  var request = new mssql.Request();
 
  request.query("select distinct p.Proj_Name, p.P_ID,at.TA_ID,t.Task_Name,t.Task_ID from Assign_Task at join Task t on t.Task_ID=at.Task_ID  join Projects p on p.P_ID=at.Proj_ID AND t.Task_Status in('In Progress','Completed') and  at.Emp_ID=" + req.body.E_ID + " ", function (err, recordset) {
    logger.info("GetAssignProjTasks was started");
    
      if (!err) {
        logger.debug("GetAssignProjTasks  Was successful");
        res.send(recordset['recordset']);
      }
      else {
        res.send([]);
        logger.error("GetAssignProjTasks  Wasn't successful: " + err);
      }
  });
});


app.post('/GetTimeSheet_ByEmp', (req, res) => {
  var request = new mssql.Request();

  request.query("select t.Task_Name,p.Proj_Name,ts.* from Timesheet ts join Projects p on p.P_ID=ts.P_ID join Assign_Task at on at.TA_ID=ts.Ts_TAID join Task t on t.Task_ID=at.Task_ID and ts.E_ID=" + req.body.E_ID + "and Week_Start_Date='" + req.body.Week_Start_Date + "' order by ts.Ts_ID desc ",
    function (err, recordset) {
      logger.info("GetTimeSheet_ByEmp was started");
      if (!err) {
        logger.debug("GetTimeSheet_ByEmp  Was successful");
        res.send(recordset['recordset']);

      }
      else {
       res.send([]);
        logger.error("GetTimeSheet_ByEmp  Wasn't successful: " + err);
      }
    });
});

app.post('/CreateTimesheet', (req, res) => {
  var request = new mssql.Request();
  let Tmsheet = req.body;

  request.query("INSERT INTO Timesheet(E_ID,P_ID,Ts_TAID,Week_Start_Date,D1,D2,D3,D4,D5,D6,D7)" +
    "VALUES(" + Tmsheet.E_ID + "," + Tmsheet.P_ID + "," + Tmsheet.TA_ID + ",'" + Tmsheet.WDate + "'," + Tmsheet.D1 + "," + Tmsheet.D2 + "," + Tmsheet.D3 + "," + Tmsheet.D4 + "," + Tmsheet.D5 + "," + Tmsheet.D6 + "," + Tmsheet.D7 + " )"
    , function (err, result) {
      logger.info("CreateTimesheet was started");
      if (!err) {
        res.send('Success');
        logger.debug("CreateTimesheet  Was successful");
      }
      else {
        logger.error("CreateTimesheet  Wasn't successful: " + err);
      }

    });
});



app.post('/UpdateTimesheet', (req, res) => {
  var request = new mssql.Request();
  var Uts = req.body;

  request.query("Update Timesheet set P_ID=" + Uts.P_ID + ",Ts_TAID=" + Uts.TA_ID + ",D1=" + Uts.D1 + ",D2=" + Uts.D2 + ",D3=" + Uts.D3 + ",D4=" + Uts.D4 + ",D5=" + Uts.D5 + ",D6=" + Uts.D6 + ",D7=" + Uts.D7 + ",Updated_Date='" + Uts.Timesheet_Updated_Date + "' WHERE Ts_ID=" + Uts.Ts_ID + " ",
    function (err, result) {
      logger.info("UpdateTimesheet was started");
      if (!err) {
        res.send('Success');
        logger.debug("UpdateTimesheet  Was successful");
      }
      else {
        logger.error("UpdateTimesheet  Wasn't successful: " + err);
      }
    })
});



app.get('/GetAllTimeSheet', (req, res) => {
  var request = new mssql.Request();
  
  request.query(" select CONCAT( CONCAT(  e.First_Name,' '), CONCAT( ' ', e.Last_Name)) as FullName,ts.*, t.Task_Name,t.Task_Working_Hours as EST_Efforts,p.Proj_Name from Timesheet ts  join Assign_Task at on at.TA_ID=ts.Ts_TAID join Task t on t.Task_ID=at.Task_ID join Projects p on p.P_ID=ts.P_ID  join Employee e on e.E_ID=ts.E_ID order by ts.Ts_ID desc ",

    function (err, recordset) {
      logger.info("GetAllTimeSheet was started");
      if (!err) {
        logger.debug("GetAllTimeSheet  Was successful");
        res.send(recordset['recordset']);

      }
      else {
       
        res.send([]);
        logger.error("GetAllTimeSheet  Wasn't successful: " + err);
      }
    });
});



app.get('/GetEmployeereportList', (req, res) => {

  var request = new mssql.Request();

  request.query("select e.Emp_ID, CONCAT(e.First_Name,' ',e.Last_Name) as Employee_Name,e.Email_ID,e.Contact_Num,e.DOJ from employee e where IsActive like '%YES%' order by doj desc", function (err, recordset) {
    logger.info("GetEmployeereportList was started");
    if (!err) {
      logger.debug("GetEmployeereportList  Was successful");
      res.send(recordset['recordset']);

    }
    else {
     
      logger.error("GetEmployeereportList  Wasn't successful: " + err);
    }
  });

});



app.get('/GetEmployeeLists', (req, res) => {

  var request = new mssql.Request();
  request.query("select e.* from employee e join roles r on e.role_id=r.role_id  where r.role_name != 'manager'and  IsActive like '%YES%'", function (err, recordset) {
    logger.info("GetEmployeeLists was started");
    if (!err) {
      logger.debug("GetEmployeeLists  Was successful");
      res.send(recordset['recordset']);

    }
    else {
     
      logger.error("GetEmployeeLists  Wasn't successful: " + err);
    }
  });
});


app.get('/GetProjectReportList', (req, res) => {

  var request = new mssql.Request();
  request.query("select p.Proj_ID,p.Proj_Name,p.Proj_Domain,p.Proj_Start_Date from Projects p", function (err, recordset) {
    logger.info("GetProjectReportList was started");
    if (!err) {
      logger.debug("GetProjectReportList  Was successful");
      res.send(recordset['recordset']);

    }
    else {
     
      logger.error("GetProjectReportList  Wasn't successful: " + err);
    }
  });

});




