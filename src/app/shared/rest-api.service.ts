import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Anomaly } from '../shared/anomaly';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  // Define API
  apiURL = environment.api;

  constructor(private http: HttpClient) {}
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  // HttpClient API get() method => Fetch reasons list
  getReasons(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiURL + '/reasons')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch actions list
  getActions(): Observable<any[]> {
    return this.http
      .get<any[]>(this.apiURL + '/actions')
      .pipe(retry(1), catchError(this.handleError));
  }

  // HttpClient API get() method => Fetch anomalies list
  getAnomalies(): Observable<Anomaly[]> {
    return this.http
      .get<Anomaly[]>(this.apiURL + '/anomalies')
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API get() method => Fetch anomaly
  getAnomaly(id: any): Observable<Anomaly> {
    return this.http
      .get<Anomaly>(this.apiURL + '/anomaly/' + id)
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API post() method => Create anomaly
  createAnomaly(anomaly: any): Observable<Anomaly> {
    return this.http
      .post<Anomaly>(
        this.apiURL + '/anomalies',
        JSON.stringify(anomaly),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API put() method => Update anomaly
  updateAnomaly(id: any, anomaly: any): Observable<Anomaly> {
    return this.http
      .put<Anomaly>(
        this.apiURL + '/anomaly/' + id,
        JSON.stringify(anomaly),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  // HttpClient API delete() method => Delete anomaly
  deleteAnomaly(id: any) {
    return this.http
      .delete<Anomaly>(this.apiURL + '/anomaly/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }
  // Error handling
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}