import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-docs-link',
    templateUrl: './docs-link.component.html',
    styleUrls: ['./docs-link.component.scss']
})
export class DocsLinkComponent implements OnInit {

  @Input() name?: string;
  @Input() text?: string;

  constructor() { }

  @HostBinding('class')
  get hostClasses(): any {
    return {
      'float-end': true
    };
  }

  ngOnInit(): void {
  }

}
