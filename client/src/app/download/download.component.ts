import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  videoName: string;
  videoId: any;
  safeUrl: SafeResourceUrl;
  videoSource: string;
  duration: string;
  formats = [];
  selectedFormat = "1";
  selectedFormatArray= {
    filesize: '',
    url: ''
  }

  constructor(private router: Router, private sanitizer: DomSanitizer) {}


  ngOnInit() {

    if (localStorage.getItem('videoData') === null) {
      this.router.navigate(['/']);
    } else {
      let videoData = JSON.parse(localStorage.getItem('videoData'));
      localStorage.clear(); 

      this.videoName = videoData['meta'].title;
      this.videoSource = videoData['meta'].source;
      this.formats = videoData['meta'].formats;
      this.duration = videoData['meta'].duration;
      this.selectedFormat = videoData['meta'].formats[0].format_id;
      this.selectedFormatArray =  videoData['meta'].formats[0];
      this.safeUrl = this.sanitizer.bypassSecurityTrustUrl(videoData['meta'].thumbnails);
      this.videoId = this.sanitizer.bypassSecurityTrustUrl("https://www.youtube.com/watch?v=" + videoData['meta'].id)
    }
  }

  onChange(event){
      this.formats.forEach(item => {
        if(item.format_id === event){
          
          this.selectedFormatArray = item;
        }
      })
  }

  goToHome(){
    localStorage.clear();
    this.router.navigate(['/']);
  }


}
