import { Component, OnInit, OnDestroy } from "@angular/core";
import { DownloadService } from "../download.service";
import { CookiesService } from "../cookies.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { SubSink } from "subsink";
declare var TypeIt;

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit {
  url: string;
  downloadClicked = false;
  linkInvalid = false;
  videoInvalid = false;
  subs = new SubSink();
  userIP: string;

  constructor(
    private download: DownloadService,
    private router: Router,
    private db: AngularFireDatabase,
    private cookies: CookiesService
  ) {}

  ngOnInit() {
    new TypeIt("#myElement", {
      loop: true
    })
      .type("Youtube")
      .pause(2000)
      .delete()
      .type("Facebook")
      .pause(2000)
      .delete()
      .type("Vimeo")
      .pause(2000)
      .go();

    this.download.getClientIPAddress().subscribe(ipdata => {
      this.userIP = ipdata['ip'];
    });

    this.cookies.checkCookie();

  }

  getUserIP() {}

  setDownload() {
    var patternYoutube = /^(https?\:\/\/)?((www\.|m\.)?youtube\.com|youtu\.?be)\/.+$/;
    var patternFacebook = /^(https?\:\/\/)?((www\.)?facebook\.com\/(?:video\.php\?v=\d+|.*?\/videos\/\d+)).+$/;
    var patternVimeo = /(https?\:\/\/)?((www\.)?vimeo\.com\/(\d+)).+$/;
    var patternPornhub = /(https?\:\/\/)?((www\.)?pornhub\.com\/(?:view_video\.php\?viewkey=\w+)).+$/;

    if (
      patternYoutube.test(this.url) ||
      patternFacebook.test(this.url) ||
      patternVimeo.test(this.url) ||
      patternPornhub.test(this.url)
    ) {
      this.downloadClicked = true;
      this.linkInvalid = false;
      this.videoInvalid = false;

      this.subs.add(
        this.download.getDownloadVideo(this.url).subscribe(data => {
          if (data["error"]) {
            this.videoInvalid = true;
            this.downloadClicked = false;
          } else {
            let timestamp = new Date().valueOf();
            const itemRef = this.db.object("all_videos/" + this.getToday() + "/" + timestamp.toString());
            itemRef.set({
              name: data["meta"].title,
              source: data["meta"].source,
              duration: data["meta"].duration,
              url: this.url,
              browser: navigator.appCodeName + " - " + navigator.appVersion,
              platform: navigator.platform,
              userIP : this.userIP
            });

            this.cookies.saveVideo(timestamp, data);
            localStorage.setItem("videoData", JSON.stringify(data));
            this.router.navigate(["/download"]);
          }
        })
      );
    } else {
      this.linkInvalid = true;
    }
  }

  getToday(){
    var d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();

    let date = year.toString() + "-" + month.toString() + "-" + day.toString();

    return date;
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
