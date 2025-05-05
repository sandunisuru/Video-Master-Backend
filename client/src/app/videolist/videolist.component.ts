import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { CookiesService } from "../cookies.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-videolist",
  templateUrl: "./videolist.component.html",
  styleUrls: ["./videolist.component.css"]
})
export class VideolistComponent implements OnInit {
  items: Observable<any[]>;
  itemRef: AngularFireObject<any>;
  constructor(
    private db: AngularFireDatabase,
    private cookies: CookiesService,
    private router: Router
  ) {
    var uid = this.cookies.getCookie("username");

    this.items = this.db.list("users/" + uid + "/videos/", ref => ref.limitToFirst(20)).valueChanges();
  }

  downloadAgain(event) {
    console.log(event);
    let videos = {
      meta: {
        duration: event.duration,
        id: event.id,
        source: event.source,
        thumbnails: event.thumbnails,
        title: event.title,
        formats: event.formats
      }
    };

    console.log(event)
    localStorage.setItem("videoData", JSON.stringify(videos));
    this.router.navigate(["/download"]);
  }

  deleteVideo(){

  }

  ngOnInit() {}
}
