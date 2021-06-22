import { HttpErrorResponse } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public employees: Employee[] = [];
  public editEmployee: Employee = <Employee>{};
  public deleteEmployee: Employee = <Employee>{};

  
  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      (response: Employee[]) => {
        this.employees = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onAddEmployee(addForm : NgForm): void{
    document.getElementById('add-employee-form')?.click();
    this.employeeService.addEmployee(addForm.value).subscribe(
      (response : Employee) => {
        console.log(response); 
        this.getEmployees();
        addForm.reset();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
        addForm.reset();
      }
    );
  }

  public onUpdateEmployee(employee : Employee): void{
    this.employeeService.updateEmployee(employee).subscribe(
      (response : Employee) => {
        console.log(response); 
        this.getEmployees();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onDeleteEmloyee(employeeId : number): void{
    this.employeeService.deleteEmployee(employeeId).subscribe(
      (response : void) => {
        console.log(response); 
        this.getEmployees();
      },
      (error : HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public searchEmployees(key : string): void{
    const resutls : Employee[] = [];
    for(const empl of this.employees){
      // if it is not -1 means we found it
      if(empl.name.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || empl.email.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || empl.phone.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      || empl.jobTitle.toLowerCase().indexOf(key.toLowerCase()) !== -1 
      ){
        resutls.push(empl);
      }

      this.employees = resutls;

      if(resutls.length === 0 || !key){
        this.getEmployees();
      }
    }
  }

  public onOpenModal(employee: Employee, mode: string): void {
    const container = document.getElementById('main-container');

    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-target', '#addEmployeeModal');
    }
    if (mode === 'edit') {
      this.editEmployee = employee;
      button.setAttribute('data-target', '#updateEmployeeModal');
    }
    if (mode === 'delete') {
      this.deleteEmployee = employee;
      button.setAttribute('data-target', '#deleteEmployeeModal');
    }

    container?.appendChild(button);
    button.click();
  }
}
