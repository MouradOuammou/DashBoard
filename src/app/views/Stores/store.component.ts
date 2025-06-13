import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  availableCameras: Camera[] = [
    { id: 'cam1', name: 'Caméra 1', icon: '📹', isActive: false },
    { id: 'cam2', name: 'Caméra 2', icon: '📹', isActive: false },
    { id: 'cam3', name: 'Caméra 3', icon: '📹', isActive: false },
    { id: 'cam4', name: 'Caméra 4', icon: '📹', isActive: false },
    { id: 'cam5', name: 'Caméra 5', icon: '📹', isActive: false },
    { id: 'cam6', name: 'Caméra 6', icon: '📹', isActive: false }
  ];

  zones: Zone[] = [
    {
      id: 'zone1',
      name: 'Zone 1',
      cameras: [],
      position: { x: 50, y: 100, width: 180, height: 150 },
      color: '#E3F2FD'
    },
    {
      id: 'electronics',
      name: 'Electronics',
      cameras: [],
      position: { x: 280, y: 80, width: 200, height: 100 },
      color: '#E1F5FE'
    },
    {
      id: 'zone3',
      name: 'Zone 3',
      cameras: [],
      position: { x: 50, y: 300, width: 180, height: 120 },
      color: '#F3E5F5'
    },
    {
      id: 'games',
      name: 'Games',
      cameras: [],
      position: { x: 530, y: 120, width: 150, height: 200 },
      color: '#E8F5E8'
    }
  ];

  selectedCamera: Camera | null = null;
  draggedCamera: Camera | null = null;
  isDragging = false;

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
      // Vérifier si la caméra n'est pas déjà dans cette zone
      const cameraExists = zone.cameras.find(c => c.id === this.draggedCamera!.id);

      if (!cameraExists) {
        // Retirer la caméra des autres zones
        this.zones.forEach(z => {
          z.cameras = z.cameras.filter(c => c.id !== this.draggedCamera!.id);
        });

        // Ajouter la caméra à la nouvelle zone
        const cameraToAdd = { ...this.draggedCamera };
        cameraToAdd.isActive = true;
        zone.cameras.push(cameraToAdd);

        // Mettre à jour le statut de la caméra disponible
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

    // Trouver dans quelle zone se trouve la caméra
    const zone = this.zones.find(z => z.cameras.some(c => c.id === camera.id));

    if (zone) {
      alert(`Caméra "${camera.name}" appartient à la zone "${zone.name}"`);
    }
  }

  removeCameraFromZone(camera: Camera, zone: Zone): void {
    // Retirer la caméra de la zone
    zone.cameras = zone.cameras.filter(c => c.id !== camera.id);

    // Remettre la caméra comme disponible
    const availableCamera = this.availableCameras.find(c => c.id === camera.id);
    if (availableCamera) {
      availableCamera.isActive = false;
    }
  }

  getZoneStyle(zone: Zone) {
    return {
      position: 'absolute',
      left: zone.position.x + 'px',
      top: zone.position.y + 'px',
      width: zone.position.width + 'px',
      height: zone.position.height + 'px',
      backgroundColor: zone.color,
      border: '2px solid #2196F3',
      borderRadius: '12px'
    };
  }

  getCameraCount(): string {
    const totalCameras = this.availableCameras.length;
    const activeCameras = this.availableCameras.filter(c => c.isActive).length;
    return `${activeCameras}/${totalCameras}`;
  }
}
