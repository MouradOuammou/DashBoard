import { Component, Input } from '@angular/core';
import packageJson from '../../../package.json';
import { NgTemplateOutlet } from '@angular/common';
import { CalloutComponent } from '@coreui/angular';

@Component({
    selector: 'app-docs-callout',
    templateUrl: './docs-callout.component.html',
    styleUrls: ['./docs-callout.component.scss'],
    imports: [CalloutComponent, NgTemplateOutlet]
})
export class DocsCalloutComponent {

 
}
