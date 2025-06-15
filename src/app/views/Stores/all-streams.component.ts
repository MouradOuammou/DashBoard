import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HlsVideoPlayerComponent } from './hls-video-player.component';
import { FormsModule } from '@angular/forms';
import { CameraZonesPipe } from './camera-zones.pipe';

@Component({
  selector: 'app-all-streams',
  standalone: true,
  imports: [CommonModule, HlsVideoPlayerComponent, FormsModule, CameraZonesPipe],
  templateUrl: './all-streams.component.html',
  styleUrls: ['./all-streams.component.scss']
})
export class AllStreamsComponent {
  availableCameras: Camera[] = [];
  zones: Zone[] = [];
  cameraZoneMasks: CameraZoneMask[] = [];
  editModeCameraId: string | null = null;
  drawingPoints: { x: number; y: number }[] = [];
  isSaveMode = false;
  draggingCenter = false;
  dragOffset = { x: 0, y: 0 };
  selectedZoneId: string | null = null;
  showZoneSelect = false;
  // Store the currently selected mask for editing (null = new shape)
  currentMaskIndex: number | null = null;
  // Store all masks for the current camera in edit mode
  currentCameraMasks: CameraZoneMask[] = [];
  @ViewChild('videoOverlay', { static: false }) videoOverlayRef?: ElementRef<HTMLCanvasElement>;

  constructor() {
    const cams = localStorage.getItem('availableCameras');
    const zones = localStorage.getItem('zones');
    const masks = localStorage.getItem('cameraZoneMasks');
    this.availableCameras = cams ? JSON.parse(cams) : [];
    this.zones = zones ? JSON.parse(zones) : [];
    this.cameraZoneMasks = masks ? JSON.parse(masks) : [];
  }

  getZoneNamesForCamera(cameraId: string): string {
    // Use zones' cameras property for association, not cameraZoneMasks
    const zoneNames = this.zones
      .filter(zone => Array.isArray(zone.cameras) && zone.cameras.some(cam => cam.id === cameraId))
      .map(zone => zone.zoneName);
    return zoneNames.join(', ');
  }

  getZoneNameById(zoneId: string): string {
    const zone = this.zones.find(z => z.id === zoneId);
    return zone ? zone.zoneName : 'Zone';
  }

  onStreamErrorAll(camera: Camera) {
    camera.streamError = 'Failed to load the video stream.';
  }

  goBackToStore() {
    // Use router if you want, or just window.history.back();
    window.history.back();
  }

  // Remove mask list UI and always show all shapes for the current camera in edit mode
  shapeColors: string[] = [
    '#ff1744', // red
    '#2979ff', // blue
    '#00e676', // green
    '#ffd600', // yellow
    '#f50057', // pink
    '#00b8d4', // cyan
    '#aeea00', // lime
    '#ff9100', // orange
    '#d500f9', // purple
    '#8d6e63'  // brown
  ];

  defineZoneCoordinates(camera: Camera) {
    if (!camera.streamUrl) {
      alert('No stream URL set for this camera.');
      return;
    }
    if (this.editModeCameraId === camera.id) {
      this.editModeCameraId = null;
      this.drawingPoints = [];
      this.isSaveMode = false;
      this.showZoneSelect = false;
      this.selectedZoneId = null;
      this.currentMaskIndex = null;
      this.currentCameraMasks = [];
      this.drawOverlay();
      return;
    }
    if (!this.getZoneNamesForCamera(camera.id)) {
      alert('This camera must be associated with a zone before defining coordinates.');
      return;
    }
    this.editModeCameraId = camera.id;
    this.isSaveMode = false;
    this.showZoneSelect = false;
    this.selectedZoneId = null;
    this.currentMaskIndex = null;
    // Always show all saved masks for this camera in edit mode
    this.currentCameraMasks = this.cameraZoneMasks.filter(mask => mask.cameraId === camera.id);
    this.drawingPoints = [];
    setTimeout(() => this.attachOverlayListeners(), 0);
    setTimeout(() => this.drawOverlay(), 0);
  }

  clearOverlay() {
    this.drawingPoints = [];
    this.isSaveMode = false;
    this.drawOverlay();
  }

  finishDrawing() {
    if (this.drawingPoints.length > 2) {
      this.isSaveMode = true;
    } else {
      alert('You need at least 3 points to define a zone.');
    }
  }

  saveOverlay() {
    // Show zone selection menu after drawing
    this.showZoneSelect = true;
    this.selectedZoneId = null;
  }

  confirmZoneSelection() {
    if (!this.selectedZoneId) {
      alert('Please select a zone.');
      return;
    }
    // Only block if a mask for this camera+zone already exists AND has valid coordinates
    const alreadyExists = this.cameraZoneMasks.some(mask =>
      mask.cameraId === this.editModeCameraId &&
      mask.zoneId === this.selectedZoneId &&
      mask.maskCoordinates &&
      (() => { try { const pts = JSON.parse(mask.maskCoordinates); return Array.isArray(pts) && pts.length > 1; } catch { return false; } })()
    );
    if (alreadyExists) {
      alert('This zone already has a defined coordinates mask for this camera.');
      return;
    }
    // Save new mask
    const mask: CameraZoneMask = {
      maskId: Date.now().toString(),
      maskCoordinates: JSON.stringify(this.drawingPoints),
      calibrationPoints: '',
      isPrimary: false,
      coveragePercentage: 0,
      confidenceLevel: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cameraId: this.editModeCameraId!,
      zoneId: this.selectedZoneId
    };
    this.cameraZoneMasks.push(mask);
    this.currentCameraMasks.push(mask);
    localStorage.setItem('cameraZoneMasks', JSON.stringify(this.cameraZoneMasks));
    this.editModeCameraId = null;
    this.drawingPoints = [];
    this.isSaveMode = false;
    this.showZoneSelect = false;
    this.selectedZoneId = null;
    this.currentMaskIndex = null;
    this.currentCameraMasks = [];
    this.drawOverlay();
  }

  cancelZoneSelection() {
    this.showZoneSelect = false;
    this.selectedZoneId = null;
  }

  attachOverlayListeners() {
    const canvas = this.videoOverlayRef?.nativeElement;
    if (!canvas) return;
    canvas.onmousedown = (e: MouseEvent) => this.onOverlayMouseDown(e);
    canvas.onmousemove = (e: MouseEvent) => this.onOverlayMouseMove(e);
    canvas.onmouseup = (e: MouseEvent) => this.onOverlayMouseUp(e);
    canvas.onmouseleave = (e: MouseEvent) => this.onOverlayMouseUp(e);
  }

  onOverlayMouseDown(e: MouseEvent) {
    if (!this.editModeCameraId) return;
    const canvas = this.videoOverlayRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    // If inside polygon, start dragging
    if (this.drawingPoints.length > 2 && this.isPointInPolygon({ x, y }, this.drawingPoints)) {
      this.draggingCenter = true;
      const center = this.getPolygonCenter(this.drawingPoints);
      this.dragOffset = { x: x - center.x, y: y - center.y };
      return;
    }
    // Otherwise, add a new point
    this.drawingPoints.push({ x, y });
    this.drawOverlay();
  }

  isPointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]): boolean {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > point.y) !== (yj > point.y)) &&
        (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 0.00001) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  onOverlayMouseMove(e: MouseEvent) {
    if (!this.editModeCameraId || !this.draggingCenter) return;
    const canvas = this.videoOverlayRef?.nativeElement;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    // Move all points by the delta
    const center = this.getPolygonCenter(this.drawingPoints);
    const dx = x - center.x - this.dragOffset.x;
    const dy = y - center.y - this.dragOffset.y;
    this.drawingPoints = this.drawingPoints.map(pt => ({ x: pt.x + dx, y: pt.y + dy }));
    this.drawOverlay();
  }

  onOverlayMouseUp(e: MouseEvent) {
    this.draggingCenter = false;
  }

  drawOverlay() {
    const canvas = this.videoOverlayRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw the current drawing shape (in progress) FIRST so it appears on top
    if (this.drawingPoints.length > 0) {
      ctx.save();
      if (this.drawingPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.drawingPoints[0].x, this.drawingPoints[0].y);
        for (let i = 1; i < this.drawingPoints.length; i++) {
          ctx.lineTo(this.drawingPoints[i].x, this.drawingPoints[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.shapeColors[this.currentCameraMasks.length % this.shapeColors.length];
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = this.shapeColors[this.currentCameraMasks.length % this.shapeColors.length];
        ctx.fill();
      }
      // Draw points for the current drawing (always)
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = this.shapeColors[this.currentCameraMasks.length % this.shapeColors.length];
      ctx.lineWidth = 2;
      for (const pt of this.drawingPoints) {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }
    // Draw all saved shapes for this camera, with zone name in the center
    if (this.editModeCameraId) {
      this.currentCameraMasks.forEach((mask, idx) => {
        if (!mask.maskCoordinates) return; // skip if empty/null
        let points: { x: number; y: number }[];
        try {
          points = JSON.parse(mask.maskCoordinates);
        } catch (e) {
          // skip invalid JSON
          return;
        }
        if (!Array.isArray(points) || points.length <= 1) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.strokeStyle = this.shapeColors[idx % this.shapeColors.length];
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 1.0;
        ctx.stroke();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = this.shapeColors[idx % this.shapeColors.length];
        ctx.fill();
        // Draw zone name in the center
        const center = this.getPolygonCenter(points);
        ctx.globalAlpha = 1.0;
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.lineWidth = 4;
        ctx.strokeText(this.getZoneNameById(mask.zoneId), center.x, center.y);
        ctx.fillText(this.getZoneNameById(mask.zoneId), center.x, center.y);
        ctx.restore();
        // Draw points for each shape
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = this.shapeColors[idx % this.shapeColors.length];
        ctx.lineWidth = 2;
        for (const pt of points) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      });
    }
  }

  // Helper to get the center of a polygon (for label placement)
  getPolygonCenter(points: { x: number; y: number }[]): { x: number; y: number } {
    let x = 0, y = 0;
    for (const pt of points) {
      x += pt.x;
      y += pt.y;
    }
    return {
      x: x / points.length,
      y: y / points.length
    };
  }

  // Toggle view for zone mask overlays (show/hide on repeated clicks)
  toggleViewZoneMask(camera: Camera) {
    // Only hide overlays if not in edit mode (not drawing, not saving, not selecting zone)
    const isViewingOnly = this.editModeCameraId === camera.id && this.drawingPoints.length === 0 && !this.isSaveMode && !this.showZoneSelect;
    if (isViewingOnly) {
      this.editModeCameraId = null;
      this.currentCameraMasks = [];
      this.drawingPoints = [];
      this.isSaveMode = false;
      this.showZoneSelect = false;
      this.selectedZoneId = null;
      this.currentMaskIndex = null;
      setTimeout(() => this.drawOverlay(), 0);
    } else {
      // Always show overlays for this camera (view mode)
      this.editModeCameraId = camera.id;
      this.isSaveMode = false;
      this.showZoneSelect = false;
      this.selectedZoneId = null;
      this.currentMaskIndex = null;
      this.currentCameraMasks = this.cameraZoneMasks.filter(mask => mask.cameraId === camera.id);
      this.drawingPoints = [];
      setTimeout(() => this.drawOverlay(), 0);
    }
  }

  // Only allow associating a zone if it doesn't already have a mask for this camera
  getAvailableZonesForCamera(cameraId: string): Zone[] {
    const usedZoneIds = this.cameraZoneMasks.filter(mask => mask.cameraId === cameraId).map(mask => mask.zoneId);
    return this.zones.filter(z => !usedZoneIds.includes(z.id));
  }

  isEditMode(camera: Camera) {
    return this.editModeCameraId === camera.id;
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
