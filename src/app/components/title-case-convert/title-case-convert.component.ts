import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'title-case-converter',
  templateUrl: './title-case-convert.component.html',
  styleUrls: ['./title-case-convert.component.css']
})
export class TitleCaseConverterComponent implements OnInit {

  title: string;
  titleCase: string;

  constructor() { }

  ngOnInit() {
  }

  onKeyUp() {
    this.titleCase = this.title;
  }

}
