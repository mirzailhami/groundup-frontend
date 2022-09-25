import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

const components = [AppComponent, ToolbarComponent];

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, AngularSvgIconModule.forRoot()],
  declarations: [...components],
  bootstrap: [AppComponent],
})
export class AppModule {}
