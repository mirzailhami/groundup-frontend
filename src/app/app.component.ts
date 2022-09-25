import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  VERSION,
  ViewChild,
} from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import SpectrogramPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js';
import { RestApiService } from './shared/rest-api.service';
import { Anomaly } from './shared/anomaly';
import { FormBuilder, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  waveAnomaly: WaveSurfer = null;
  waveNormal: WaveSurfer = null;

  @ViewChild('anomaly') anomaly: ElementRef;
  @ViewChild('normal') normal: ElementRef;

  anomalies: Anomaly[] = [];
  reasons: any[] = [];
  actions: any[] = [];

  updateForm = this.formBuilder.group({
    reason: ['', Validators.required],
    action: ['', Validators.required],
    comments: ['', Validators.required]
  });

  selectedAlert!: Anomaly;
  reasonOptions: any[];

  constructor(private cdr: ChangeDetectorRef, public sanitizer: DomSanitizer, private api: RestApiService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.api.getAnomalies().subscribe((anomalies) => {
      this.anomalies = anomalies;
      this.selectedAlert = anomalies[0];
      this.generateWaveAnomaly();
      this.generateWaveNormal();
    });
    this.api.getReasons().subscribe((reasons) => {
      this.reasons = reasons;
      this.reasonOptions = reasons.filter(t => t.machine === this.selectedAlert?.machine);
    });
    this.api.getActions().subscribe((actions) => this.actions = actions);
  }

  onSubmit() {
    this.api.updateAnomaly(this.selectedAlert._id, this.updateForm.value).subscribe(res => {
      const idx = this.anomalies.findIndex(t => t._id === res._id);
      this.anomalies[idx] = { ...this.anomalies[idx], ...this.updateForm.value };
      this.updateForm.reset();
    });
  }

  setSelectedAlert(alert: Anomaly) {
    this.selectedAlert = alert;
    this.reasonOptions = this.reasons.filter(t => t.machine === this.selectedAlert?.machine);
    this.anomaly.nativeElement  
  }

  generateWaveAnomaly(): void {
    Promise.resolve(null).then(() => {
      this.waveAnomaly = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#3478FC',
        progressColor: '#93b3f2',
        height: 144,
        responsive: true,
        hideScrollbar: true,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline',
          }),
          SpectrogramPlugin.create({
            container: '#wave-spectrogram',
            height: 300,
          }),
        ],
      });
      if (this.selectedAlert?.soundClip) {
        this.waveAnomaly.load(this.selectedAlert.soundClip);
        this.waveAnomaly.on('seek', (e) => {
          this.anomaly.nativeElement.currentTime =
            e * this.anomaly.nativeElement.duration;
        });
      }
    });
  }

  generateWaveNormal(): void {
    Promise.resolve(null).then(() => {
      this.waveNormal = WaveSurfer.create({
        container: '#waveform-normal',
        waveColor: '#3478FC',
        progressColor: '#93b3f2',
        height: 144,
        responsive: true,
        hideScrollbar: true,
        plugins: [
          TimelinePlugin.create({
            container: '#wave-timeline-normal',
          }),
          SpectrogramPlugin.create({
            container: '#wave-spectrogram-normal',
            height: 300,
          }),
        ],
      });
      if (this.selectedAlert?.soundClip) {
        this.waveNormal.load(this.selectedAlert.soundClip);
        this.waveNormal.on('seek', (e) => {
          this.anomaly.nativeElement.currentTime =
            e * this.anomaly.nativeElement.duration;
        });
      }
    });
  }

  onPlayAnomalyPressed(): void {
    if (!this.waveAnomaly) {
      this.waveAnomaly.on('ready', () => {
        this.waveAnomaly.play();
        // this.waveAnomaly.params.container.style.opacity = 0.9;
      });
    } else {
      this.waveAnomaly.playPause();
    }
    this.waveAnomaly.setMute(true);
  }

  onAnomalySeeking() {
    if (this.waveAnomaly) {
      const currentTime = this.anomaly.nativeElement.currentTime;
      const duration = this.anomaly.nativeElement.duration;
      const position = currentTime / duration;

      var currentProgress =
        this.waveAnomaly.getCurrentTime() / this.waveAnomaly.getDuration();
      if (currentProgress != position) {
        this.waveAnomaly.seekTo(position);
      }
    }
  }

  onPlayNormalPressed(): void {
    if (!this.waveNormal) {
      this.waveNormal.on('ready', () => {
        this.waveNormal.play();
      });
    } else {
      this.waveNormal.playPause();
    }
    this.waveNormal.setMute(true);
  }

  onNormalSeeking() {
    if (this.waveNormal) {
      const currentTime = this.normal.nativeElement.currentTime;
      const duration = this.normal.nativeElement.duration;
      const position = currentTime / duration;

      var currentProgress =
        this.waveNormal.getCurrentTime() / this.waveNormal.getDuration();
      if (currentProgress != position) {
        this.waveNormal.seekTo(position);
      }
    }
  }
}
