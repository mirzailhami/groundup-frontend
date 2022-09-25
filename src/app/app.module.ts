import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

const components = [AppComponent, ToolbarComponent];

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  declarations: [...components],
  bootstrap: [AppComponent],
})
export class AppModule {}
