import { Injectable } from "@angular/core";
import * as uuid from "uuid";
import { AngularFireDatabase } from "@angular/fire/database";
declare var alertify;

@Injectable({
  providedIn: "root"
})
export class CookiesService {
  constructor(private db: AngularFireDatabase) {}

  setCookie(exyears) {
    var d = new Date();
    var cvalue = uuid.v4();
    d.setTime(d.getTime() + exyears * 365 * 24 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = "username=" + cvalue + ";" + expires + ";path=/";

    const itemRef = this.db.object("users/" + cvalue);
    itemRef.set({
      userId: cvalue
    });
  }

  saveVideo(timestamp, video){
    var uid = this.getCookie("username");

    const itemRef = this.db.object("users/" + uid + "/videos/"+ timestamp);
    itemRef.set(video.meta);

  }

  getVideos(){
    var uid = this.getCookie("username");

    
  }

  getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  checkCookie() {
    var user = this.getCookie("username");
    if (user != "") {
      
    } else {
      alertify.alert('For Your Information!', 'This website is using Cookies to store your previous videos to improve your experiecne!');
      this.setCookie(2);
    }
  }
}
