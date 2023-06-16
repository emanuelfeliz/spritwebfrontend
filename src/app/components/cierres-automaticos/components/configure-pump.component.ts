import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { LadoSelectedCierre } from '../../../models/cierres-automaticos/lado-seleccionado.model';
import { CierresAutomaticosService } from '../../../services/cierres-automaticos.service';
import { PopupProviderService, PopupType } from '../../../services/popupProvider.service';
import { DataDia } from '../../../models/cierres-automaticos/data-dia.model';
import { ConfPumpData } from '../../../models/cierres-automaticos/conf-pump-data.model';
import { HelperServiceService } from '../../../services/helper-service.service';
declare var require;
@Component({
  selector: 'app-configure-pump',
  templateUrl: './configure-pump.component.html'
})
export class ConfigurePumpComponent implements OnInit, AfterViewInit {

  dataLados: Array<LadoSelectedCierre>;
  @Input() type: string;

  fecha_hora: string;
  activated = false;
  es: any;
  esLocale = require('date-fns/locale/es');
  constructor(private _HelperServiceService:HelperServiceService,private popupProviderService: PopupProviderService,
    private _CierresAutomaticosService: CierresAutomaticosService) {
  }
  selectAll = () => {
    this.dataLados.forEach(e => e.seleccionado = true);
  }
  ngAfterViewInit() {

  }
  formatTime(n) {  // always returns a string
    return (n < 10 ? '0' : '') + n;
  }
  public resetComponent = () => {
    this.activated = false;
    this.fecha_hora = '';
    this.dataLados.forEach(e => e.seleccionado = false);
  }
  ngOnInit() {
    this.es = this._HelperServiceService.getTimeConfiguration(this.esLocale);
    this.GetPumps();
    const now = new Date();
    this.fecha_hora =
      this.formatTime(now.getFullYear()) +
      this.formatTime(now.getMonth()) +
      this.formatTime(now.getDay()) + ' ' +
      this.formatTime(now.getHours()) +
      this.formatTime(now.getMinutes()) +
      this.formatTime(now.getSeconds());
  }

  public setCreatedDate(date:string) {
    this.fecha_hora = date;
  }

  public propagateData = (data: Array<ConfPumpData>) => {
    const propagatedData = data.find(x => x.type === this.type).data;
    this.activated = propagatedData.activo;
    this.fecha_hora = propagatedData.fecha +  propagatedData.hora;
    propagatedData.lados.forEach((l) => {
      this.dataLados.forEach((e) => {
        if (e.lado === l) {
          e.seleccionado = true;
        }
      });
    });
  }
  public getData = (): ConfPumpData => {
    return new ConfPumpData(new DataDia(this.activated, this.dataLados
      .filter(x => x.seleccionado === true)
      .map(x => x.lado),
      this.fecha_hora.split(' ')[1],
      this.fecha_hora.split(' ')[0]), this.type);
  }
  public GetPumps = () => {
    this._CierresAutomaticosService.GetLadosBomba()
      .then(data => {
        this.dataLados = data;
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage
          ('Fallo al obtener lados', error, PopupType.ERROR);
      });
  }
}
