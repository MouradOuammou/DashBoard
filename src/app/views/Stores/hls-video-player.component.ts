import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'app-hls-video-player',
  template: `
    <video #videoPlayer width="100%" controls autoplay style="background: #000; max-height: 60vh;"></video>
  `,
  standalone: true
})
export class HlsVideoPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() src = '';
  @Output() error = new EventEmitter<string>();
  @ViewChild('videoPlayer', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;
  private hls?: Hls;

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    if (!this.src) {
      this.error.emit('No stream URL provided.');
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
      video.play().catch(() => this.error.emit('Failed to play the video stream.'));
    } else if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          this.error.emit('Failed to load the video stream.');
        }
      });
      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => this.error.emit('Failed to play the video stream.'));
      });
    } else {
      this.error.emit('HLS is not supported in this browser.');
    }
  }

  ngOnDestroy() {
    if (this.hls) {
      this.hls.destroy();
    }
  }
}
