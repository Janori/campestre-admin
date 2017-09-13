import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../shared/services/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [ EmployeeService ]
})
export class EmployeesComponent implements OnInit {

  constructor(
      private _employeeService: EmployeeService
  ) { }

  ngOnInit() {
      this._employeeService.getAllEmployees().subscribe(
          result => {
              console.log(result);
          },
          error => {
              alert('Ops! something went wrong');
              console.log(error);
          }
      );
  }

}
