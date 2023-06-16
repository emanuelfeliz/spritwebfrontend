import { Injectable } from '@angular/core';
import { InvocationService } from 'app/services/invocationService.service';
import { Turno } from 'app/models/consulta-ventas/Turno.model';
import { ModelList } from 'app/models/ModelList.model';
import { SerieLineal } from 'app/models/consulta-ventas/SerieLineal.model';
import { DataGraficoPies } from 'app/models/consulta-ventas/DataGraficoPies.model';
import { ProductPump } from 'app/models/consulta-ventas/ProductPump.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { resultConsultaVenta } from '../models/consulta-ventas/resultConsultaVenta.model';
import { environment } from 'environments/environment';
@Injectable()
export class ConsultaventasService {

  private url: string;
  constructor(private invocationService: InvocationService,) {
    this.url =environment.Urls.Baseurl;
  }
  getTurnos = (): Promise<ModelList<Turno>> => {
    const route = `api/ConsultaVentas/getTurnos`;
    return this.invocationService.invokeBackendService<ModelList<Turno>, null>(this.invocationService.GET, this.url + route);
  }
  ConsultarVentas = (tipoFiltro: string, tDesde: number, tHasta: number, fDesde: string, fHasta: string,
    selectedPumpsId: string, selectedProductosId: string, pagina: number, limite: number,
    filtroCampo: string, campoDesde: number, campoHasta: number):
    Promise<GenericResponse<resultConsultaVenta>> => {
    let route = `api/ConsultaVentas/ConsultarVentas?tipoFiltro=${tipoFiltro}&turnoDesde=${tDesde}&turnoHasta=${tHasta}`;
    route += `&fDesde=${fDesde}&fHasta=${fHasta}&selectedPumpsId=${selectedPumpsId}`;
    route += `&selectedProductosId=${selectedProductosId}&pagina=${pagina}&limite=${limite}`;
    route += `&filtroCampo=${filtroCampo}&campoDesde=${campoDesde}&campoHasta=${campoHasta}`;
    return this.invocationService.invokeBackendService<GenericResponse<resultConsultaVenta>, null>
      (this.invocationService.GET, this.url + route);
  };

  ExportSales = (tipoFiltro: string, tDesde: number, tHasta: number, fDesde: string, fHasta: string,
    selectedPumpsId: string, selectedProductosId: string, pagina: number, limite: number,
    filtroCampo: string, campoDesde: number, campoHasta: number):
    Promise<string> => {
    let route = `api/ConsultaVentas/ExportSales?tipoFiltro=${tipoFiltro}&turnoDesde=${tDesde}&turnoHasta=${tHasta}`;
    route += `&fDesde=${fDesde}&fHasta=${fHasta}&selectedPumpsId=${selectedPumpsId}`;
    route += `&selectedProductosId=${selectedProductosId}&pagina=${pagina}&limite=${limite}`;
    route += `&filtroCampo=${filtroCampo}&campoDesde=${campoDesde}&campoHasta=${campoHasta}`;
    return this.invocationService.invokeBackendService<string, null>
      (this.invocationService.GET, this.url + route);
  };

  GraficosLinealVentas = (fDesde: string, fHasta: string, selectedPumpsId: string, selectedProductosId: string,
    campo: string, grupo: string, tipoFiltro: string, tDesde: number, tHasta: number,
    filtroCampo: string, campoDesde: number, campoHasta: number): Promise<ModelList<SerieLineal>> => {
    let route: string = `api/ConsultaVentas/GraficosLinealVentas?fDesde=${fDesde}&fHasta=${fHasta}`;
    route += `&selectedPumpsId=${selectedPumpsId}&selectedProductosId=${selectedProductosId}&campo=${campo}&grupo=${grupo}`;
    route += `&tipoFiltro=${tipoFiltro}&turnoDesde=${tDesde}&turnoHasta=${tHasta}`;
    route += `&filtroCampo=${filtroCampo}&campoDesde=${campoDesde}&campoHasta=${campoHasta}`;
    return this.invocationService.invokeBackendService<ModelList<SerieLineal>, null>(this.invocationService.GET, this.url + route);
  }
  GraficosPieVentas = (fDesde: string, fHasta: string, selectedPumpsId: string, selectedProductosId: string,
    tipoFiltro: string, tDesde: number, tHasta: number, filtroCampo: string, campoDesde: number, campoHasta: number)
    : Promise<ModelList<DataGraficoPies>> => {
    let route: string = `api/ConsultaVentas/GraficosPieVentas?fDesde=${fDesde}&fHasta=${fHasta}`;
    route += `&selectedPumpsId=${selectedPumpsId}&selectedProductosId=${selectedProductosId}`;
    route += `&tipoFiltro=${tipoFiltro}&turnoDesde=${tDesde}&turnoHasta=${tHasta}`;
    route += `&filtroCampo=${filtroCampo}&campoDesde=${campoDesde}&campoHasta=${campoHasta}`;
    return this.invocationService.invokeBackendService<ModelList<DataGraficoPies>, null>(this.invocationService.GET, this.url + route);
  }
  GetProducts = (): Promise<ModelList<ProductPump>> => {
    let route: string = `api/ConsultaVentas/GetProducts`;
    return this.invocationService.invokeBackendService<ModelList<ProductPump>, null>(this.invocationService.GET, this.url + route);
  };
  GetPumps = (): Promise<ModelList<ProductPump>> => {
    let route: string = `api/ConsultaVentas/GetPumps`;
    return this.invocationService.invokeBackendService<ModelList<ProductPump>, null>(this.invocationService.GET, this.url + route);
  };
}

