import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @Input() titulo: string;
  @Input() menu: string;
  constructor() { }

  ngOnInit() {
  }

}
