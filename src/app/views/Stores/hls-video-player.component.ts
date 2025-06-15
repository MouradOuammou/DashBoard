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
  private errorTimeout?: any;
  private hasPlayed = false;

  ngAfterViewInit() {
    const video = this.videoRef.nativeElement;
    if (!this.src) {
      this.error.emit('No stream URL provided.');
      return;
    }
    // Set a timeout to emit error only if video doesn't start playing in time
    this.errorTimeout = setTimeout(() => {
      if (!this.hasPlayed) {
        this.error.emit('Failed to load the video stream.');
      }
    }, 5000); // 5 seconds

    const onPlaying = () => {
      this.hasPlayed = true;
      if (this.errorTimeout) {
        clearTimeout(this.errorTimeout);
        this.errorTimeout = undefined;
      }
    };
    video.addEventListener('playing', onPlaying);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = this.src;
      video.play().catch(() => this.error.emit('Failed to play the video stream.'));
    } else if (Hls.isSupported()) {
      this.hls = new Hls();
      this.hls.loadSource(this.src);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          // Only emit error if not already playing
          if (!this.hasPlayed) {
            this.error.emit('Failed to load the video stream.');
          }
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
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.videoRef?.nativeElement?.removeEventListener('playing', () => {});
  }
}
