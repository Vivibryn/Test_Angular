import { Component, OnInit } from '@angular/core';
import { ArmaServConnection } from 'src/app/classes/info-connection';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-info-nuance',
  templateUrl: './info-nuance.component.html',
  styleUrls: ['./info-nuance.component.css']
})
export class InfoNuanceComponent implements OnInit {

  result: any[] ;
  dataSource: any[] ;
  displayedColumns ;

  constructor(private http: HttpClient) { 
     
  }

  ngOnInit() {
    ArmaServConnection.GET(this.http, "GetAllGrade", [])
    .subscribe((res) => {
      this.result = res.result[0];
      this.displayedColumns = ['Name'];
      this.dataSource = this.result;
      console.log(this.dataSource)
    })

  }


}
interface DiamLinearWeight {
  Diam: string,
  LinWeight: string
}

interface Grade {
  Name: string,
  ShortName: string,
  Code: string,
  Default: number
}

interface ArmaServResultInterface  {
  result: any[] // Le result ici peut etre n'importequoi (DiamLinearWeight, Grade, ...)
}
