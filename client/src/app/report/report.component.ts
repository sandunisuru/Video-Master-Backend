import { Component, OnInit } from '@angular/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  wordCount = 0;
  message: string;
  messgeSent = false;
  messgeSentFailed = false;
  errorMessage: string;
  sending = false;

  constructor(private report: ReportService) { }

  ngOnInit() {
  }

  sendEmail() {
    if (this.message.length > 10) {
      this.sending = true;
      this.messgeSentFailed = false;
      this.messgeSent = false;
      this.report.sendEmailfromServer(this.message).subscribe(data => {
        if (data["status"] == 200) {
          this.sending = false;
          this.messgeSent = true;
          this.messgeSentFailed = false;
          this.message = "";
          this.wordCount = 0;
        } else {
          this.sending = false;
          this.messgeSent = false;
          this.messgeSentFailed = true;
          this.errorMessage = data["message"];
        }
      })
    } else {
      this.sending = false;
      this.messgeSent = false;
      this.messgeSentFailed = true;
      this.errorMessage = "You need to enter Atleast 10 Letters.";
    }

  }

  setLetterCount(event) {
    this.wordCount = this.message.length;
  }

}
