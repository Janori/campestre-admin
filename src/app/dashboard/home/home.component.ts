import { Component, OnInit } from '@angular/core';

import { CSVExport } from "../../shared/misc/exportable/export.csv";
import { ReportService } from '../../shared/services/report.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    providers: [ ReportService ]
})
export class HomeComponent implements OnInit {

  constructor(private _reportService: ReportService) { }

  generateReport = (url: string) => {
      this._reportService.generateReportData(url).subscribe(result => {
          let csv = new CSVExport(result.data, {
            headers: ["code", "nombre", "status"]
          });

      });
  }

  ngOnInit() {
  }

}
