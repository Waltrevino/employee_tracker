var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1q$yM13060120",
    database: "employees_db"
});

connection.connect(function (error) {
    if (error) throw error;
    start();
})

function start() {
    inquirer.prompt(({
        name: "action",
        type: "rawlist",
        message: "What would you like to do to the Employees database?",
        choices: [
            "Add a department.",
            "Add role.",
            "Add an employee.",
            "View departments.",
            "View roles.",
            "View employees.",
            "Update employee role.",
            "Exit"
        ]
    }))
        .then(function (answer) {
            switch (answer.action) {
                case "Add a department.":
                    addDepartment();
                    break;
                case "Add role.":
                    addRole();
                    break;
                case "Add an employee.":
                    addEmployee();
                    break;
                case "View departments.":
                    viewDepartment();
                    break;
                case "View roles.":
                    viewAllRoles();
                    break;
                case "View employees.":
                    vewAllEmployees();
                    return;
                case "Update employee role.":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    exit();
                    break;
            }
        })
}

function exit() {
    connection.end();
}

function continueYorN() {
    inquirer.prompt([{
        type: "confirm",
        message: "Would you like to make another change to the Employees database?",
        name: "continue"
    }])
        .then(function (answer) {
            if (answer.continue) {
                start();
            } else {
                exit();
            }
        })
}

function addDepartment() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the dapartent you wish to add?",
        name: "department"
    },
    {
        type: "input",
        message: "What is the department id?",
        name: "id"
    }])
        .then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                { id: answer.id,
                  name: answer.department
                },
                function (error) {
                    if (error) throw error;
                    console.log(`The ${answer.department} department was added successfully!`);
                    continueYorN();
                   
                });
        });
}

function addRole() {
    inquirer.prompt([{
        type: "input",
        message: "What is the name of the role you wish to add?",
        name: "role"
    },
    {
        type: "input",
        message: "What is the role id?",
        name: "id"
    },
    {
        type: "input",
        message: "What is the salary for this role?",
        name: "salary"
    },
    {
        type: "input",
        message: "What department id does this role belong to?",
        name: "department"
    }])
        .then(function (answers) {
            connection.query(
                "INSERT INTO role SET ?",
                {
                    id: answers.id,
                    title: answers.role,
                    salary: answers.salary,
                    department_id: answers.department
                },
                function (error) {
                    if (error) throw error;
                    console.log(`The ${answers.role} role was added successfully!`);
                    continueYorN();
                });
        });
}


function addEmployee() {
    inquirer.prompt([{
        type: "input",
        message: "What is the first name of the employee you wish to add?",
        name: "first_name"
    },
    {
        type: "input",
        message: "What is this employee's last name?",
        name: "last_name"
    },
    {
        type: "input",
        message: "What is the role id for this employee?",
        name: "role_id"
    },
    {
        type: "input",
        message: "What is this employee's manager's id?",
        name: "manager_id"
    }])
        .then(function (answers) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answers.first_name,
                    last_name: answers.last_name,
                    role_id: answers.role_id,
                    manager_id: answers.manager_id
                },
                function (error) {
                    if (error) throw error;
                    console.log(`Employee ${answers.first_name} ${answers.last_name} was added successfully!`);
                    continueYorN();
                });
        });
}

function viewDepartment() {
    connection.query(
        "SELECT * FROM department", function (error, results) {
            if (error) throw error;
            console.table(results);
            continueYorN();
        });
}

function viewAllRoles() {
    connection.query(
        "SELECT * FROM role", function (error, results) {
            if (error) throw error;
            console.table(results);
            continueYorN();
        });
}

function vewAllEmployees() {
    connection.query(
        "SELECT * FROM employee", function (error, results) {
            if (error) throw error;
            console.table(results);
            continueYorN();
        });
}

function getRoles(){
    var array = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
        ];
    return array;
}

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function (error, results) {
        if (error) throw error;
        inquirer.prompt([{
            type: "list",
            message: "Name of employee to update role for:",
            name: "employee",
            choices: function () {
                var employees = [];
                for (var i = 0; i < results.length; i++) {
                    employees.push(results[i].first_name + " " + results[i].last_name);
                }
                return employees;
            }
        },
        {
            type: "rawlist",
            message: "Select the new role:",
            name: "new_role",
            choices: getRoles()
        }])
            .then(function ({ new_role, employee }) {
                var name = employee.split(" ");
                var firstName = name[0];
                var lastName = name[1];
                connection.query(
                    "UPDATE employee SET ? WHERE ? AND ?", [
                    {
                        role_id: new_role
                    },
                    {
                        first_name: firstName
                    },
                    {
                        last_name: lastName
                    }
                ],
                    function (error) {
                        if (error) throw error;
                        console.log(`${employee}'s role has been updated successfully!`);
                        continueYorN();
                    });
            });
    });
}

