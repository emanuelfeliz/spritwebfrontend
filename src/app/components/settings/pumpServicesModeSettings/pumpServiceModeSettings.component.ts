import { Component, OnInit } from "@angular/core";

import { IResponseWithList } from "app/models/GenericResponse.model";
import { HttpService } from "app/services/communication_services/http.service";
import { PopupProviderService, PopupType } from "app/services/popupProvider.service";
import { environment } from "environments/environment";
import { IPumpServiceMode } from "./pump.interface";

@Component({
  selector: 'app-pump-service-mode-settings',
  templateUrl: './pumpServiceModeSettings.component.html',
  styleUrls: ['./pumpServiceModeSettings.component.css']

})
export class PumpServiceModeSettings implements OnInit {

  pumpServicesModes: IPumpServiceMode[] = [];
  servicesModesTypes: {};

  constructor(private httpService: HttpService, private popupService: PopupProviderService) {
    this.servicesModesTypes = { 0: 'SELF_SERVICE', 1: 'FULL_SERVICE' };
  }
  ngOnInit(): void {
    this.getPumpServiceModes();
  }

  getPumpServiceModes() {
    this.httpService.Get<IResponseWithList<IPumpServiceMode>>(`${environment.Urls.SmartApiUrl}api/`, 'pumps/ServicesModes')
      .subscribe(response => {
        this.pumpServicesModes = response.list;
      }, error => {
        console.log(error);
      });
  }

  updatePumpServiceMode(pump: IPumpServiceMode, serviceMode: number) {

    this.httpService.Put<{}>(`${environment.Urls.SmartApiUrl}api/`, 'pumps/ServicesModes', 0,
      {
        id: pump.id,
        pump: pump.pump,
        serviceMode: serviceMode
      }).subscribe(response => {
        const serviceModeIndex = this.pumpServicesModes.findIndex(x => (x.id === pump.id) && (x.pump === pump.pump));
        this.pumpServicesModes[serviceModeIndex].serviceMode = this.servicesModesTypes[serviceMode];

        this.popupService.SimpleMessage('Configuración de los Dispensadores', response['message'], PopupType.SUCCESS);
      }, error => {
        console.log(error);
        this.popupService.SimpleMessage('Configuración de los Dispensadores', 'Error', PopupType.SUCCESS);
      })
  }
}


