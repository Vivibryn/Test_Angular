import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tableau',
  templateUrl: './tableau.component.html',
  styleUrls: ['./tableau.component.css']
})

export class TableauComponent implements OnInit {

  @Input() grades: any;

  constructor() { }

  ngOnInit() {

    console.log(this.grades);
  }

}
