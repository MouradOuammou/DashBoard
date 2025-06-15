import { Pipe, PipeTransform } from '@angular/core';
import { Zone, CameraZoneMask } from './all-streams.component';

@Pipe({ name: 'cameraZones', standalone: true })
export class CameraZonesPipe implements PipeTransform {
  transform(zones: Zone[], cameraId: string | null, cameraZoneMasks?: CameraZoneMask[]): Zone[] {
    if (!cameraId || !zones) return [];
    // Get zone IDs associated with this camera
    let linkedZoneIds: string[] = [];
    if (cameraZoneMasks && cameraZoneMasks.length) {
      linkedZoneIds = cameraZoneMasks.filter(mask => mask.cameraId === cameraId).map(mask => mask.zoneId);
    } else {
      // fallback: try to get from localStorage
      const masks = localStorage.getItem('cameraZoneMasks');
      if (masks) {
        linkedZoneIds = JSON.parse(masks).filter((mask: CameraZoneMask) => mask.cameraId === cameraId).map((mask: CameraZoneMask) => mask.zoneId);
      }
    }
    return zones.filter(zone => linkedZoneIds.includes(zone.id));
  }
}
