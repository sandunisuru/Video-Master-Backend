import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DownloadComponent } from './download/download.component';
import { AboutComponent } from './about/about.component';
import { ReportComponent } from './report/report.component';
import { VideolistComponent } from './videolist/videolist.component';

const routes: Routes = [
  {
      path: '',
      component: MainComponent
  },
  {
    path: 'download',
    component: DownloadComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'report',
    component: ReportComponent
  },
  {
    path: 'videos',
    component: VideolistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
