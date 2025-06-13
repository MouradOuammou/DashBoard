import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Camera {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

interface Zone {
  id: string;
  name: string;
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
  availableCameras: Camera[] = [];
  zones: Zone[] = [];
  selectedCamera: Camera | null = null;
  draggedCamera: Camera | null = null;
  draggedZone: Zone | null = null;
  isDragging = false;
  isDraggingZone = false;
  dragOffset = { x: 0, y: 0 };
  errorMessage: string = '';
  showZoneForm: boolean = false;

  // Propriétés pour le redimensionnement
  resizingZone: Zone | null = null;
  resizeStart = { x: 0, y: 0 };
  initialSize = { width: 0, height: 0 };
  resizeDirection: 'e' | 's' | 'se' | null = null;

  newCamera: Camera = {
    id: '',
    name: '',
    icon: 'fas fa-video',
    isActive: false
  };

  newZone: Zone = {
    id: '',
    name: '',
    cameras: [],
    position: { x: 0, y: 0, width: 200, height: 150 },
    color: '#E3F2FD'
  };

  ngOnInit(): void {}

  onDragStart(event: DragEvent, camera: Camera): void {
    this.draggedCamera = camera;
    this.isDragging = true;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', camera.id);
    }
  }

  onDragEnd(event: DragEvent): void {
    this.draggedCamera = null;
    this.isDragging = false;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, zone: Zone): void {
    event.preventDefault();
    if (this.draggedCamera) {
      const cameraExists = zone.cameras.some(c => c.id === this.draggedCamera!.id);
      if (!cameraExists) {
        const cameraToAdd = { ...this.draggedCamera, isActive: true };
        zone.cameras.push(cameraToAdd);
        const availableCamera = this.availableCameras.find(c => c.id === this.draggedCamera!.id);
        if (availableCamera) {
          availableCamera.isActive = true;
        }
      }
    }
    this.draggedCamera = null;
    this.isDragging = false;
  }

  onCameraClick(camera: Camera): void {
    this.selectedCamera = camera;
    const zonesWithCamera = this.zones.filter(z => z.cameras.some(c => c.id === camera.id));
    if (zonesWithCamera.length > 0) {
      const zoneNames = zonesWithCamera.map(z => z.name).join(', ');
      alert(`Caméra "${camera.name}" est assignée aux zones : ${zoneNames}`);
    } else {
      alert(`Caméra "${camera.name}" n'est assignée à aucune zone`);
    }
  }

  onZoneClick(zone: Zone): void {
    console.log('Zone clicked:', zone);
  }

  removeCameraFromZone(cameraId: string, zoneId: string): void {
    const zone = this.zones.find(z => z.id === zoneId);
    if (zone) {
      zone.cameras = zone.cameras.filter(c => c.id !== cameraId);
      const camera = this.availableCameras.find(c => c.id === cameraId);
      if (camera) {
        camera.isActive = false;
      }
    }
  }

  removeZone(zoneId: string): void {
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

  resetCameraForm(): void {
    this.newCamera = {
      id: '',
      name: '',
      icon: 'fas fa-video',
      isActive: false
    };
    this.errorMessage = '';
  }

  resetZoneForm(): void {
    this.newZone = {
      id: '',
      name: '',
      color: '#E3F2FD',
      cameras: [],
      position: { x: 0, y: 0, width: 200, height: 150 }
    };
    this.errorMessage = '';
  }

  addCamera(): void {
    if (!this.newCamera.id.trim() || !this.newCamera.name.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }
    if (this.availableCameras.some(cam => cam.id === this.newCamera.id)) {
      this.errorMessage = 'Une caméra avec cet ID existe déjà';
      return;
    }
    this.availableCameras.push({ ...this.newCamera });
    this.resetCameraForm();
  }

  addZone(): void {
    if (!this.newZone.id.trim() || !this.newZone.name.trim()) {
      this.errorMessage = 'Veuillez remplir tous les champs requis';
      return;
    }
    if (this.zones.some(zone => zone.id === this.newZone.id)) {
      this.errorMessage = 'Une zone avec cet ID existe déjà';
      return;
    }
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      this.newZone.position = {
        x: (rect.width - this.newZone.position.width) / 2,
        y: (rect.height - this.newZone.position.height) / 2,
        width: this.newZone.position.width,
        height: this.newZone.position.height
      };
    }
    this.zones.push({ ...this.newZone });
    this.resetZoneForm();
  }

  onZoneDragStart(event: DragEvent, zone: Zone): void {
    this.draggedZone = zone;
    this.isDraggingZone = true;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  }

  onZoneDragEnd(event: DragEvent): void {
    this.draggedZone = null;
    this.isDraggingZone = false;
  }

  onMapDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onMapDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.draggedZone) {
      const mapContainer = document.querySelector('.map-container');
      if (mapContainer) {
        const rect = mapContainer.getBoundingClientRect();
        const x = event.clientX - rect.left - this.dragOffset.x;
        const y = event.clientY - rect.top - this.dragOffset.y;
        this.updateZonePosition(this.draggedZone, x, y);
      }
    }
    this.draggedZone = null;
    this.isDraggingZone = false;
  }

  updateZonePosition(zone: Zone, x: number, y: number): void {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
      const rect = mapContainer.getBoundingClientRect();
      const maxX = rect.width - zone.position.width;
      const maxY = rect.height - zone.position.height;
      zone.position.x = Math.max(0, Math.min(x, maxX));
      zone.position.y = Math.max(0, Math.min(y, maxY));
    }
  }

  onZoneResizeStart(event: MouseEvent, zone: Zone, direction: 'e' | 's' | 'se'): void {
    event.stopPropagation();
    this.resizingZone = zone;
    this.resizeDirection = direction;
    this.resizeStart = { x: event.clientX, y: event.clientY };
    this.initialSize = { width: zone.position.width, height: zone.position.height };
    document.addEventListener('mousemove', this.onZoneResizeMove.bind(this));
    document.addEventListener('mouseup', this.onZoneResizeEnd.bind(this));
  }

  onZoneResizeMove(event: MouseEvent): void {
    if (!this.resizingZone || !this.resizeDirection) return;
    const deltaX = event.clientX - this.resizeStart.x;
    const deltaY = event.clientY - this.resizeStart.y;
    if (this.resizeDirection.includes('e')) {
      this.resizingZone.position.width = Math.max(150, this.initialSize.width + deltaX);
    }
    if (this.resizeDirection.includes('s')) {
      this.resizingZone.position.height = Math.max(100, this.initialSize.height + deltaY);
    }
  }

  onZoneResizeEnd(): void {
    this.resizingZone = null;
    this.resizeDirection = null;
    document.removeEventListener('mousemove', this.onZoneResizeMove.bind(this));
    document.removeEventListener('mouseup', this.onZoneResizeEnd.bind(this));
  }

  isZoneResizing(zone: Zone): boolean {
    return this.resizingZone?.id === zone.id;
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

  // Méthode pour obtenir le nombre de caméras actives
  getCameraCount(): string {
    const totalCameras = this.availableCameras.length;
    const activeCameras = this.availableCameras.filter(c => c.isActive).length;
    return `${activeCameras}/${totalCameras}`;
  }

  // Méthode pour supprimer une caméra
  removeCamera(cameraId: string): void {
    // Supprimer la caméra de toutes les zones
    this.zones.forEach(zone => {
      zone.cameras = zone.cameras.filter(c => c.id !== cameraId);
    });
    // Supprimer la caméra de la liste des caméras disponibles
    this.availableCameras = this.availableCameras.filter(c => c.id !== cameraId);
  }
}
