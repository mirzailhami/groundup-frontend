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

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  wave: WaveSurfer = null;

  @ViewChild('anomaly') anomaly: ElementRef;
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

  constructor(private cdr: ChangeDetectorRef, private api: RestApiService, private formBuilder: FormBuilder) {}

  ngOnInit() {
     this.api.getAnomalies().subscribe((anomalies) => {
      this.anomalies = anomalies;
      this.selectedAlert = anomalies[0];
      this.generateWaveform();
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
      this.anomalies[idx] = {...this.anomalies[idx], ...this.updateForm.value};
      this.updateForm.reset();
    });
  }

  setSelectedAlert(alert: Anomaly) {
    this.selectedAlert = alert;
    this.reasonOptions = this.reasons.filter(t => t.machine === this.selectedAlert?.machine);
  }

  ngAfterViewInit(): void {
    
    // Promise.resolve().then(() => {
    // });
  }

  generateWaveform(): void {
    Promise.resolve(null).then(() => {
      this.wave = WaveSurfer.create({
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
      this.wave.load(this.selectedAlert?.soundClip);
      this.wave.on('seek', (e) => {
        this.anomaly.nativeElement.currentTime =
          e * this.anomaly.nativeElement.duration;
      });
    });
  }

  onPlayPressed(): void {
    if (!this.wave) {
      this.wave.on('ready', () => {
        this.wave.play();
        // this.wave.params.container.style.opacity = 0.9;
      });
    } else {
      this.wave.playPause();
    }
    this.wave.setMute(true);
  }

  onSeeking() {
    if (this.wave) {
      const currentTime = this.anomaly.nativeElement.currentTime;
      const duration = this.anomaly.nativeElement.duration;
      const position = currentTime / duration;

      var currentProgress =
        this.wave.getCurrentTime() / this.wave.getDuration();
      if (currentProgress != position) {
        this.wave.seekTo(position);
      }
    }
  }
}
