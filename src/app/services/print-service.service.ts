import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ReporteRecibido } from 'app/models/ReportesGenerator/ReporteRecibido.model';
declare var screen: any;

@Injectable()
export class PrintServiceService {
  private url: string;
  constructor() {
    this.url = environment.Urls.Baseurl;
  }
  generateReporte = (reporte: ReporteRecibido, showModal: boolean) => {
    this.openNewTab(`WebForms/ManejadorReportes.aspx?reporteGeneral=${JSON.stringify(reporte)}`, 'Reporte');
  };
  openNewTab(parameters: string, title: string) {
    const route: string = this.url + parameters;
    let w: number = 900;
    let h: number = 1000;

    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(route, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
      newWindow.focus();
    }
  }
}
