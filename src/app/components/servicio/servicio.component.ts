import { PopupProviderService, PopupType } from './../../services/popupProvider.service';
import { Component, OnInit } from '@angular/core';
import { ConsolaServicioService } from '../../services/consolaServicio.service';
import { Module } from '../../models/service/Module.model';
import { Process } from '../../models/service/Process.model';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html'
})
export class ServicioComponent implements OnInit {

  serviceStatus = false;
  modules: Array<Module> = [];
  constructor(private PopupProviderService: PopupProviderService,
    private consolaServicioService: ConsolaServicioService) {

  }
  activeProcess = (module: Module, process: Process): void => {
    this.consolaServicioService.ToggleProcess(true, module, process)
    .then(response=>{
      if(response.Success){
        this.GetModules();
      }else{
        this.PopupProviderService.SimpleMessage('No se pudo activar el proceso',response.PossibleError,PopupType.ERROR);
      }
    })
    .catch(error=>{

    });
  }
  deactiveProcess = (module: Module, process: Process): void => {
    this.consolaServicioService.ToggleProcess(false, module, process)
    .then(response=>{
      if(response.Success){
        this.GetModules();
      }else{
        this.PopupProviderService.SimpleMessage('No se pudo desactivar el proceso',response.PossibleError,PopupType.ERROR);
      }
    })
    .catch(error=>{

    });
  }
  GetModules() {
    this.consolaServicioService.GetDataConfig()
    .then(response => {
      if(response.Success){
        this.modules = response.Response;
      }else{
        this.PopupProviderService.SimpleMessage('No se pudo completar la operación',response.PossibleError,PopupType.WARNING);
      }
    })
    .catch(error=>{
      this.PopupProviderService.SimpleMessage('Fallo al obtener datos del servicio',error,PopupType.ERROR);
    });
  }
  ngOnInit() {
    this.isRunning();
    this.GetModules();
  }
  Iniciar(){
    this.consolaServicioService.StartService()
    .then(response => {
      if(response.Success){
        this.isRunning();
      }else{
        this.PopupProviderService.SimpleMessage('No se pudo completar la operación',response.Response,PopupType.WARNING);
      }
    })
    .catch(error=>{
      this.PopupProviderService.SimpleMessage('Fallo al obtener datos del servicio',error,PopupType.ERROR);
    });
  }
  Detener(){
    this.consolaServicioService.StopService()
    .then(response => {
      if(response.Success){
        this.isRunning();
      }else{
        this.PopupProviderService.SimpleMessage('No se pudo completar la operación',response.Response,PopupType.WARNING);
      }
    })
    .catch(error=>{
      this.PopupProviderService.SimpleMessage('Fallo al obtener datos del servicio',error,PopupType.ERROR);
    });
  }
  isRunning(){
    this.consolaServicioService.serviceIsRunning()
    .then(response => {
      if(response.Success){
        this.serviceStatus = true;
      }else{
        this.serviceStatus = false;
      }
    })
    .catch(error=>{
      this.PopupProviderService.SimpleMessage('Fallo al obtener datos del servicio',error,PopupType.ERROR);
    });
  }
}
