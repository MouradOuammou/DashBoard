import { Component } from '@angular/core';
import timezones from './timezones.json';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-store-settings',
  templateUrl: './store-settings.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./store-settings.component.scss']
})
export class StoreSettingsComponent {
  weekDays: string[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];
  timeOptions: string[] = [];
  schedule: any[] = [
    { day: 'Monday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Tuesday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Wednesday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Thursday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Friday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Saturday', status: 'open', from: '08:00', to: '22:00' },
    { day: 'Sunday', status: 'open', from: '08:00', to: '22:00' },
  ];
  timezones: any[] = (timezones as any[]);

  constructor() {
    this.generateTimeOptions();
  }

  generateTimeOptions() {
    // Generates time options in 30 min intervals
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        this.timeOptions.push(`${hour}:${min}`);
      }
    }
  }
}
