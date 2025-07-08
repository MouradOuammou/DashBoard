import { CommonModule, DatePipe, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';


import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent,
    CommonModule, DatePipe
  ]
})
export class DashboardComponent implements OnInit {
  cameras: any[] = [];
  zones: any[] = [];
  users: any[] = [];
  roles: string[] = [];
  userLogs: { date: string; user: string; role: string; action: string }[] = [];

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public mainChart: IChartProps = { type: 'line' };
  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.loadEntities();
    this.loadUserLogs();
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initMainChart(value);
    this.initCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }

  loadEntities() {
    // Try to load from localStorage, fallback to mock data
    const cams = localStorage.getItem('availableCameras');
    const zones = localStorage.getItem('zones');
    const users = localStorage.getItem('users');
    const roles = localStorage.getItem('roles');
    this.cameras = cams ? JSON.parse(cams) : [
      { id: 'CAM001', cameraName: 'Entrance Cam' },
      { id: 'CAM002', cameraName: 'Checkout Cam' }
    ];
    this.zones = zones ? JSON.parse(zones) : [
      { id: 'ZONE001', zoneName: 'Entrance' },
      { id: 'ZONE002', zoneName: 'Checkout' }
    ];
    this.users = users ? JSON.parse(users) : [
      { id: '1', nom: 'Benali', prenom: 'Hicham', role: 'ADMIN' },
      { id: '2', nom: 'Mourad', prenom: 'Ahmed', role: 'USER' },
      { id: '3', nom: 'Walid', prenom: 'Karim', role: 'MODERATOR' },
      { id: '4', nom: 'Anas', prenom: 'Mehdi', role: 'USER' },
      { id: '5', nom: 'Berrada', prenom: 'Youssef', role: 'ADMIN' },
      { id: '6', nom: 'Essaidi', prenom: 'Amine', role: 'USER' },
      { id: '7', nom: 'Tazi', prenom: 'Hamza', role: 'USER' },
      { id: '8', nom: 'Alaoui', prenom: 'Othman', role: 'USER' },
      { id: '9', nom: 'El Idrissi', prenom: 'Imran', role: 'MODERATOR' },
      { id: '10', nom: 'Kabbaj', prenom: 'Yassine', role: 'USER' },
      { id: '11', nom: 'El Fassi', prenom: 'Salma', role: 'ADMIN' },
      { id: '12', nom: 'Bennis', prenom: 'Omar', role: 'USER' },
      { id: '13', nom: 'Zouiten', prenom: 'Imane', role: 'USER' },
      { id: '14', nom: 'Ait', prenom: 'Ali', role: 'MODERATOR' },
      { id: '15', nom: 'El Mansouri', prenom: 'Nadia', role: 'USER' },
      { id: '16', nom: 'Boukhris', prenom: 'Samir', role: 'USER' },
      { id: '17', nom: 'El Amrani', prenom: 'Layla', role: 'ADMIN' },
      { id: '18', nom: 'Ouazzani', prenom: 'Rachid', role: 'USER' }
    ];
    this.roles = roles ? JSON.parse(roles) : ['ADMIN', 'USER'];
  }

  loadUserLogs() {
    // Try to load from localStorage, fallback to mock data
    const logs = localStorage.getItem('userLogs');
    this.userLogs = logs ? JSON.parse(logs) : [
      { date: '2025-06-15T08:10:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Login' },
      { date: '2025-06-15T08:12:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Viewed Cameras' },
      { date: '2025-06-15T08:15:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Edited store layout' },
      { date: '2025-06-15T08:20:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Viewed streams' },
      { date: '2025-06-15T08:22:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Defined zone masks' },
      { date: '2025-06-15T08:25:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Changed Role' },
      { date: '2025-06-15T08:27:00Z', user: 'Imran Benali', role: 'ADMIN', action: 'Deleted Camera' },
 ];
  }

  // Optionally, add a method to add a log entry
  addUserLog(user: string, role: string, action: string) {
    const log = { date: new Date().toISOString(), user, role, action };
    this.userLogs.unshift(log);
    localStorage.setItem('userLogs', JSON.stringify(this.userLogs));
  }
}
