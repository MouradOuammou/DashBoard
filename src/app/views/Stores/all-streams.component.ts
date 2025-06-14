import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlsVideoPlayerComponent } from './hls-video-player.component';

@Component({
  selector: 'app-all-streams',
  standalone: true,
  imports: [CommonModule, HlsVideoPlayerComponent],
  templateUrl: './all-streams.component.html',
  styleUrls: ['./all-streams.component.scss']
})
export class AllStreamsComponent {
  availableCameras: Camera[] = [];
  zones: Zone[] = [];
  cameraZoneMasks: CameraZoneMask[] = [];

  constructor() {
    const cams = localStorage.getItem('availableCameras');
    const zones = localStorage.getItem('zones');
    const masks = localStorage.getItem('cameraZoneMasks');
    this.availableCameras = cams ? JSON.parse(cams) : [];
    this.zones = zones ? JSON.parse(zones) : [];
    this.cameraZoneMasks = masks ? JSON.parse(masks) : [];
  }

  getZoneNamesForCamera(cameraId: string): string {
    const linkedZoneIds = this.cameraZoneMasks
      .filter(mask => mask.cameraId === cameraId)
      .map(mask => mask.zoneId);
    const zoneNames = this.zones
      .filter(zone => linkedZoneIds.includes(zone.id))
      .map(zone => zone.zoneName);
    return zoneNames.join(', ');
  }

  onStreamErrorAll(camera: Camera) {
    camera.streamError = 'Failed to load the video stream.';
  }

  goBackToStore() {
    // Use router if you want, or just window.history.back();
    window.history.back();
  }

  defineZoneCoordinates(camera: Camera) {
    // TODO: Implement zone coordinate definition logic
    alert('Define zone coordinates for ' + camera.cameraName);
  }

  toggleCoordinates(camera: Camera) {
    // TODO: Implement toggle coordinates overlay logic
    alert('Toggle coordinates overlay for ' + camera.cameraName);
  }
}

// Camera interface and demo camera data for AllStreamsComponent
export interface Camera {
  id: string;
  cameraName: string;
  resolutionWidth: number;
  resolutionHeight: number;
  streamUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  icon?: string;
  isActive?: boolean;
  showMenu?: boolean;
  streamError?: string;
}

export interface CameraZoneMask {
  maskId: string;
  maskCoordinates: string;
  calibrationPoints: string;
  isPrimary: boolean;
  coveragePercentage: number;
  confidenceLevel: number;
  createdAt: string;
  updatedAt: string;
  cameraId: string;
  zoneId: string;
}

export interface Zone {
  id: string;
  zoneName: string;
  zoneType: 'PRODUCT' | 'CHECKOUT' | 'ENTRANCE' | 'CORRIDOR';
  minDwellTime: number;
  cameras: Camera[];
  isActive: boolean;
  showMenu?: boolean;
  position: { x: number; y: number; width: number; height: number };
  color: string;
}

export const DEMO_CAMERAS: Camera[] = [
  {
    id: '1',
    cameraName: 'Front Entrance',
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    streamUrl: 'http://localhost:8888/mystream/index.m3u8',
    status: 'ACTIVE',
    icon: 'fas fa-video',
    isActive: true
  },
  {
    id: '2',
    cameraName: 'Checkout',
    resolutionWidth: 1280,
    resolutionHeight: 720,
    streamUrl: '',
    status: 'INACTIVE',
    icon: 'fas fa-video',
    isActive: false
  },
  {
    id: '3',
    cameraName: 'Aisle 3',
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    streamUrl: '',
    status: 'MAINTENANCE',
    icon: 'fas fa-video',
    isActive: false
  }
];
