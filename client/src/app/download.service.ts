import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private http: HttpClient) { }

  private baseUrl = environment.apiBaseUrl;

  getDownloadVideo(url: string){

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json' });
    let options = { headers: headers };

    let data = {
      url: url
    }

    return this.http.post(`${this.baseUrl}/video`, data, options);
  }

  getClientIPAddress(){
   
    return this.http.get("https://api.ipify.org?format=json");
  }
}
