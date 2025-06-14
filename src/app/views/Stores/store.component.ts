import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Camera {
  id: string;
  cameraName: string;
  resolutionWidth: number;
  resolutionHeight: number;
  streamUrl: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  icon?: string;
  isActive?: boolean;
}

interface Zone {
  id: string;
  zoneName: string;
  zoneType: 'PRODUCT' | 'CHECKOUT' | 'ENTRANCE' | 'CORRIDOR';
  minDwellTime: number;
  isActive: boolean;
  cameras: Camera[];
  position: { x: number; y: number; width: number; height: number };
  color: string;
}

@Component({
  selector: 'app-store-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  // Lists state
  availableCameras: Camera[] = [];
  zones: Zone[] = [];
  
  // Drag state
  draggedCamera: Camera | null = null;
  dragOffset = { x: 0, y: 0 };
  
  // Resize state
  isResizing = false;
  resizeDirection: 'e' | 's' | 'se' | null = null;
  activeZone: Zone | null = null;
  resizeStartPos = { x: 0, y: 0 };
  resizeStartDimensions = { width: 0, height: 0 };
  
  // Dialog state
  showCameraDialog = false;
  showZoneDialog = false;
  errorMessage = '';

  // New item forms
  newCamera: Camera = {
    id: '',
    cameraName: '',
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    streamUrl: '',
    status: 'ACTIVE',
    icon: 'fas fa-video',
    isActive: false
  };

  newZone: Zone = {
    id: '',
    zoneName: '',
    zoneType: 'PRODUCT',
    minDwellTime: 0,
    isActive: true,
    cameras: [],
    position: { x: 10, y: 10, width: 200, height: 150 },
    color: '#e9ecef'
  };

  // Drag state for zones
  isDraggingZone = false;
  draggedZone: Zone | null = null;

  constructor() {}

  // Sample data for development/demo
  ngOnInit(): void {
    this.availableCameras = [
      { id: 'CAM001', cameraName: 'Entrance Cam', resolutionWidth: 1920, resolutionHeight: 1080, streamUrl: '', status: 'ACTIVE', icon: 'bi bi-camera-fill', isActive: true },
      { id: 'CAM002', cameraName: 'Checkout Cam', resolutionWidth: 1920, resolutionHeight: 1080, streamUrl: '', status: 'INACTIVE', icon: 'bi bi-camera-fill', isActive: false },
      { id: 'CAM003', cameraName: 'Aisle Cam', resolutionWidth: 1920, resolutionHeight: 1080, streamUrl: '', status: 'MAINTENANCE', icon: 'bi bi-camera-fill', isActive: false }
    ];
    this.zones = [
      { id: 'ZONE001', zoneName: 'Entrance', zoneType: 'ENTRANCE', minDwellTime: 0, isActive: true, cameras: [], position: { x: 40, y: 40, width: 200, height: 120 }, color: '#e9ecef' },
      { id: 'ZONE002', zoneName: 'Checkout', zoneType: 'CHECKOUT', minDwellTime: 0, isActive: true, cameras: [], position: { x: 300, y: 60, width: 200, height: 120 }, color: '#ffe0b2' },
      { id: 'ZONE003', zoneName: 'Aisle', zoneType: 'PRODUCT', minDwellTime: 0, isActive: false, cameras: [], position: { x: 100, y: 250, width: 200, height: 120 }, color: '#c8e6c9' }
    ];
  }

  // Camera counter
  getCameraCount(): number {
    return this.availableCameras.length;
  }

  // Camera dialog methods
  openCameraDialog() {
    this.showCameraDialog = true;
  }

  closeCameraDialog() {
    this.showCameraDialog = false;
    this.resetCameraForm();
  }

  addCamera() {
    if (!this.newCamera.id.trim() || !this.newCamera.cameraName.trim()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    if (this.availableCameras.some(cam => cam.id === this.newCamera.id)) {
      this.errorMessage = 'A camera with this ID already exists';
      return;
    }
    this.availableCameras.push({ 
      ...this.newCamera,
      isActive: this.newCamera.status === 'ACTIVE'
    });
    this.closeCameraDialog();
  }

  resetCameraForm() {
    this.newCamera = {
      id: '',
      cameraName: '',
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      streamUrl: '',
      status: 'ACTIVE',
      icon: 'fas fa-video',
      isActive: false
    };
    this.errorMessage = '';
  }

  // Zone dialog methods
  openZoneDialog() {
    this.showZoneDialog = true;
  }

  closeZoneDialog() {
    this.showZoneDialog = false;
    this.resetZoneForm();
  }

  addZone() {
    if (!this.newZone.id.trim() || !this.newZone.zoneName.trim()) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }
    if (this.zones.some(zone => zone.id === this.newZone.id)) {
      this.errorMessage = 'A zone with this ID already exists';
      return;
    }

    const newPosition = {
      x: Math.random() * 600,
      y: Math.random() * 400,
      width: 200,
      height: 150
    };

    this.zones.push({
      ...this.newZone,
      cameras: [],
      position: newPosition
    });
    this.closeZoneDialog();
  }

  resetZoneForm() {
    this.newZone = {
      id: '',
      zoneName: '',
      zoneType: 'PRODUCT',
      minDwellTime: 0,
      isActive: true,
      cameras: [],
      position: { x: 10, y: 10, width: 200, height: 150 },
      color: '#e9ecef'
    };
    this.errorMessage = '';
  }

  // Zone operations
  removeZone(zoneId: string) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.cameras.forEach(camera => {
        const cam = this.availableCameras.find(c => c.id === camera.id);
        if (cam) {
          cam.isActive = false;
        }
      });
      this.zones = this.zones.filter(z => z.id !== zoneId);
    }
  }

  removeCameraFromZone(cameraId: string, zoneId: string) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.cameras = zone.cameras.filter(c => c.id !== cameraId);
      const camera = this.availableCameras.find(c => c.id === cameraId);
      if (camera) {
        camera.isActive = false;
      }
    }
  }

  // Remove a zone from the map only (not from the list)
  removeZoneFromMap(zoneId: string) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.isActive = false;
    }
  }

  // Add a zone back to the map from the list
  showZoneOnMap(zoneId: string) {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.isActive = true;
    }
  }

  // Remove a camera from the map but keep it in the list
  hideCameraFromMap(cameraId: string) {
    const camera = this.availableCameras.find(c => c.id === cameraId);
    if (camera) {
      camera.isActive = false;
    }
    // Also remove from all zones
    this.zones.forEach(zone => {
      zone.cameras = zone.cameras.filter(c => c.id !== cameraId);
    });
  }

  // Add a camera back to the map from the list
  showCameraOnMap(cameraId: string) {
    const camera = this.availableCameras.find(c => c.id === cameraId);
    if (camera) {
      camera.isActive = true;
    }
  }

  // --- ZONE DRAG/DROP/RESIZE LOGIC ---
  onZoneMouseDown(event: MouseEvent, zone: Zone) {
    // Prevent drag if resizing
    if (this.isResizing) return;
    this.isDraggingZone = true;
    this.draggedZone = zone;
    const zoneElem = event.currentTarget as HTMLElement;
    const rect = zoneElem.getBoundingClientRect();
    this.dragOffset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    event.preventDefault();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // --- Resizing ---
    if (this.isResizing && this.activeZone) {
      const mapContainer = document.querySelector('.map-container');
      if (!mapContainer) return;
      const rect = mapContainer.getBoundingClientRect();
      let newWidth = this.resizeStartDimensions.width;
      let newHeight = this.resizeStartDimensions.height;
      const minWidth = 80;
      const minHeight = 60;
      if (this.resizeDirection === 'e' || this.resizeDirection === 'se') {
        newWidth = this.resizeStartDimensions.width + (event.clientX - this.resizeStartPos.x);
        newWidth = Math.max(minWidth, newWidth);
        newWidth = Math.min(newWidth, rect.width - this.activeZone.position.x);
      }
      if (this.resizeDirection === 's' || this.resizeDirection === 'se') {
        newHeight = this.resizeStartDimensions.height + (event.clientY - this.resizeStartPos.y);
        newHeight = Math.max(minHeight, newHeight);
        newHeight = Math.min(newHeight, rect.height - this.activeZone.position.y);
      }
      this.activeZone.position.width = newWidth;
      this.activeZone.position.height = newHeight;
      return;
    }
    // --- Dragging ---
    if (this.isDraggingZone && this.draggedZone && !this.isResizing) {
      const mapContainer = document.querySelector('.map-container');
      if (!mapContainer) return;
      const rect = mapContainer.getBoundingClientRect();
      let x = event.clientX - rect.left - this.dragOffset.x;
      let y = event.clientY - rect.top - this.dragOffset.y;
      const maxX = rect.width - this.draggedZone.position.width;
      const maxY = rect.height - this.draggedZone.position.height;
      this.draggedZone.position.x = Math.max(0, Math.min(x, maxX));
      this.draggedZone.position.y = Math.max(0, Math.min(y, maxY));
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    // Always clear resize state
    if (this.isResizing) {
      this.isResizing = false;
      this.activeZone = null;
      this.resizeDirection = null;
    }
    // Always clear drag state
    if (this.isDraggingZone) {
      this.isDraggingZone = false;
      this.draggedZone = null;
    }
  }

  onZoneResizeStart(event: MouseEvent, zone: Zone, direction: 'e' | 's' | 'se') {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizeDirection = direction;
    this.activeZone = zone;
    this.resizeStartPos = { x: event.clientX, y: event.clientY };
    this.resizeStartDimensions = {
      width: zone.position.width,
      height: zone.position.height
    };
    // Prevent drag while resizing
    this.isDraggingZone = false;
    this.draggedZone = null;
  }

  isZoneResizing(zone: Zone): boolean {
    return this.isResizing && this.activeZone === zone;
  }

  getResizeHandleStyle(direction: 'e' | 's' | 'se'): any {
    const baseStyle = {
      position: 'absolute',
      background: '#2196F3',
      opacity: 0.5,
      transition: 'opacity 0.2s'
    };
    switch (direction) {
      case 'e':
        return {
          ...baseStyle,
          right: '-4px',
          top: '0',
          width: '8px',
          height: '100%',
          cursor: 'e-resize'
        };
      case 's':
        return {
          ...baseStyle,
          bottom: '-4px',
          left: '0',
          width: '100%',
          height: '8px',
          cursor: 's-resize'
        };
      case 'se':
        return {
          ...baseStyle,
          bottom: '-4px',
          right: '-4px',
          width: '12px',
          height: '12px',
          cursor: 'se-resize'
        };
    }
  }

  // Utility methods
  onDragStart(event: DragEvent, camera: Camera) {
    this.draggedCamera = camera;
    if (event.dataTransfer) {
      event.dataTransfer.setData('camera', camera.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragEnd(event: DragEvent) {
    this.draggedCamera = null;
  }

  onMapDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onMapDrop(event: DragEvent) {
    event.preventDefault();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!event.dataTransfer) return;

    // Handle camera drop
    const cameraId = event.dataTransfer.getData('camera');
    if (cameraId && this.draggedCamera) {
      const dropZone = this.findZoneAtPoint(x, y);
      if (dropZone && !dropZone.cameras.some((c: Camera) => c.id === cameraId)) {
        const camera = { ...this.draggedCamera, isActive: true };
        dropZone.cameras.push(camera);
        const availCamera = this.availableCameras.find((c: Camera) => c.id === cameraId);
        if (availCamera) {
          availCamera.isActive = true;
        }
      }
      return;
    }

    // Handle zone drop from list
    const zoneId = event.dataTransfer.getData('zone');
    if (zoneId) {
      const zone = this.zones.find((z: Zone) => z.id === zoneId);
      if (zone) {
        zone.isActive = true;
        // Center the zone under the cursor
        zone.position.x = x - zone.position.width / 2;
        zone.position.y = y - zone.position.height / 2;
        // Clamp to map bounds
        const mapWidth = rect.width;
        const mapHeight = rect.height;
        zone.position.x = Math.max(0, Math.min(zone.position.x, mapWidth - zone.position.width));
        zone.position.y = Math.max(0, Math.min(zone.position.y, mapHeight - zone.position.height));
      }
    }
  }

  private findZoneAtPoint(x: number, y: number): Zone | null {
    return this.zones.find((zone: Zone) => {
      const pos = zone.position;
      return zone.isActive && x >= pos.x && x <= pos.x + pos.width && y >= pos.y && y <= pos.y + pos.height;
    }) || null;
  }

  // Drag and drop for zones from the list
  onZoneDragStart(event: DragEvent, zone: Zone) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('zone', zone.id);
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onZoneDragEnd(event: DragEvent, zone: Zone) {
    // No-op for now, but can be used for visual feedback
  }

  saveMap() {
    // For now, just log the current state. Replace with real save logic as needed.
    console.log('Saving map...');
    console.log('Zones:', this.zones);
    console.log('Cameras:', this.availableCameras);
    // You can add API call or file export logic here.
  }
}
