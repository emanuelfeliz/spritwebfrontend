import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CierresAutomaticosService } from '../../services/cierres-automaticos.service';
import { Router } from '@angular/router';
import { GenericResponse } from '../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { CierreAutomatico } from '../../models/cierres-automaticos/cierre-automatico.model';
import { ConfigurePumpComponent } from './components/configure-pump.component';
import { ConfPumpData } from '../../models/cierres-automaticos/conf-pump-data.model';
declare var $;
@Component({
  selector: 'app-cierres-automaticos',
  templateUrl: './cierres-automaticos.component.html',
  styleUrls: ['./cierres-automaticos.component.css']
})
export class CierresAutomaticosComponent implements OnInit {
  mes = 'Todos';
  tipo_evento = 'Dia';
  cierreAutomatico: CierreAutomatico;
  loading = false;
  cierres: Array<CierreAutomatico> = [];
  creando = false;
  editando = false;
  textoBoton: string;
  @ViewChildren(ConfigurePumpComponent) childComponents: QueryList<ConfigurePumpComponent>;

  constructor(private popupProviderService: PopupProviderService,
    private _CierresAutomaticosService: CierresAutomaticosService, private router: Router) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.cierres_automaticos === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.textoBoton = 'Crear cierre';
        this.resetModel();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  resetModel = (): void => {
    const c: Array<ConfPumpData> = [];
    this.cierreAutomatico = new CierreAutomatico(0, c, '', '', '',false);
  }
  getData = () => {
    this.loading = true;
    this._CierresAutomaticosService.MostrarData()
      .then(data => {
        if (data.PossibleError === '') {
          this.cierres = data.List;
        } else {
          this.popupProviderService.SimpleMessage('Cierres automáticos',
            data.PossibleError, PopupType.WARNING);
        }
        this.loading = false;
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Cierres automáticos',
          error, PopupType.ERROR);
        this.loading = false;
      });
  }
  reset = () => {
    setTimeout(() => this.childComponents.forEach(c => c.resetComponent()), 0);
  }
  saveCierreConfig = () => {
    this.loading = true;
    const dataChilds: Array<ConfPumpData> = [];
    this.childComponents.forEach(c => dataChilds.push(c.getData()));
    this.cierreAutomatico.configuraciones_pump_data = dataChilds;
    this.cierreAutomatico.mes = this.mes;
    this.cierreAutomatico.tipo_cierre = this.tipo_evento;
    if (this.creando) {
      this._CierresAutomaticosService.saveCierre(this.cierreAutomatico)
        .then(data => {
          if (data.Success) {
            this.popupProviderService.SimpleMessage('Cierres automáticos',
              'Cierre guardado correctamente', PopupType.SUCCESS);
          } else {
            this.popupProviderService.SimpleMessage('Cierres automáticos',
              data.PossibleError, PopupType.ERROR);
          }
          this.loading = false;
          this.resetModel();
          this.reset();
          this.getData();
          this.creando = false;
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Cierres automáticos',
            error, PopupType.ERROR);
          this.loading = false;
        });
    } else {
      this._CierresAutomaticosService.editcierre(this.cierreAutomatico)
        .then(data => {
          if (data.Success) {
            this.popupProviderService.SimpleMessage('Cierres automáticos',
              'Cierre editado correctamente', PopupType.SUCCESS);
          } else {
            this.popupProviderService.SimpleMessage('Cierres automáticos',
              data.PossibleError, PopupType.ERROR);
          }
          this.loading = false;
          this.resetModel();
          this.reset();
          this.getData();
          this.editando = false;
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Cierres automáticos',
            error, PopupType.ERROR);
          this.loading = false;
        });
    }
    this.botones();
  }
  editarCierre = (cierre: CierreAutomatico) => {
    console.log(cierre);
    this.creando = false;
    this.editando = true;
    this.textoBoton = 'Cancelar edición';
    this.tipo_evento = cierre.tipo_cierre;
    this.mes = cierre.mes;
    this.cierreAutomatico = cierre;

    setTimeout(() => this.childComponents.forEach(x => {
      x.propagateData(cierre.configuraciones_pump_data);
      x.setCreatedDate(cierre.fecha_registro);
    }), 0);
    setTimeout(() => this.tipoEventoChanged(), 1000);
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.textoBoton = 'Cancelar';
      this.resetModel();
      this.reset();
    } else if (this.creando) {
      this.creando = false;
      this.textoBoton = 'Crear cierre';
      this.resetModel();
      this.reset();
      this.getData();
    } else if (this.editando) {
      this.editando = false;
      this.textoBoton = 'Crear cierre';
      this.resetModel();
      this.reset();
      this.getData();
    }
  }
  deleteCierre = (cierre_id: number) => {
    this._CierresAutomaticosService.deleteCierre(cierre_id).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage('Éxito', 'Cierre eliminado',
          PopupType.SUCCESS);
        this.getData();
      } else {
        this.popupProviderService.SimpleMessage('Cierre no eliminado', 'Algo salió mal!',
          PopupType.ERROR);
      }
    }).catch(error => {
      this.popupProviderService.SimpleMessage('Cierre no eliminado', error,
        PopupType.ERROR);
    });
  }
  confirmarBorrarCierre = (cierre: CierreAutomatico) => {
    this.popupProviderService.QuestionMessage('Eliminar cierre', `Estás seguro de eliminar el cierre?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteCierre(cierre.id_registro);
      }, () => {
      });
  }
  activateTab = (tabName: string) => {
    $('.nav-tabs a[href="#' + tabName + '"]').tab('show');
  }
  tipoEventoChanged = () => {
    if (this.tipo_evento === 'Dia') {
      this.activateTab('lunes');
    } else if (this.tipo_evento === 'Diario') {
      this.activateTab('todos-los-dias');
    } else if (this.tipo_evento === 'Unico') {
      this.activateTab('evento-unico');
    }
  }
  ngOnInit() {
    this.getData();
  }
}
