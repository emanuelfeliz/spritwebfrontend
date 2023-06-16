import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { PopupProviderService, PopupType } from '../../../../services/popupProvider.service';
import { ResumenLado } from '../../../../models/pump-tablet/resumen_lado.model';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AutenticadorBomberosService } from '../../../../services/autenticador-bomberos.service';
import { RespuestaAutenticacionBombero } from '../../../../modalsGenerales/RespuestaAutenticacionBombero.model';
import { BomberoByLado } from '../../../../models/manipulacion-venta/BomberoByLado.model';
import { VentasService } from '../../../../services/ventas.service';
import { SaleManipulationProviderService } from '../../services/sale-manipulation-provider.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-pumps-selection',
  templateUrl: './pumps-selection.component.html'
})
export class PumpsSelectionComponent implements OnInit, OnDestroy{

  MODAL_AUTENTICACION_BOMBEROS: Subscription;
  canReceiveKeyPress = true;
  lados: Array<ResumenLado> = [];
  currentAction = 'Nothing';
  private keyPressInfoEmitterSubscription: Subscription;
  private dataLadosSubscription: Subscription;
  constructor(private router: Router,
    private SaleManipulationProviderService: SaleManipulationProviderService,
    private VentasService: VentasService, private autenticadorBombero: AutenticadorBomberosService,
    private popupProvider: PopupProviderService, private actr: ActivatedRoute) {
    this.currentAction = 'Nothing';
    this.SaleManipulationProviderService.emitBomberoYLadoInfo(null);
    this.dataLadosSubscription = this.actr.data.map(data => data.dataLados).subscribe((res) => {
      this.lados = res;
    });
   
   this.keyPressInfoEmitterSubscription = this.SaleManipulationProviderService.keyPressInfoEmitter.subscribe((data) => {
      if (data !== null && data.receiver === 'pumps-selection' && this.canReceiveKeyPress && this.currentAction === 'Nothing' && 
        (parseInt(data.key) >= 0 && parseInt(data.key) <= 9 || data.key == 'enter' || data.key == '-' || data.key == '*')) {
   
          if(sessionStorage.getItem('firstDigit') === '') {        
            sessionStorage.setItem('firstDigit',data.key);      
          }
          else{
            sessionStorage.setItem('secondDigit',data.key);       
          }
        
          let combinedDigits: number = parseInt(sessionStorage.getItem('firstDigit')+sessionStorage.getItem('secondDigit'), 10);    

          if (combinedDigits > this.lados.length)
            {
              this.popupProvider.SimpleMessage('El lado ' + combinedDigits+'  no existe', 'Error', PopupType.ERROR);
              this.cleanDigits(); 
              return;
            }
          
          if(sessionStorage.getItem('secondDigit') !=='' && combinedDigits > 0) {        
            this.selectPump(this.lados[combinedDigits-1]);
            this.cleanDigits();              
          }     

      }
    });
  }
  disableKeyPressEntry = (): void => {
    setTimeout(() => this.canReceiveKeyPress = true, 2000)
  }
  selectPump = (data: ResumenLado): void => {
    this.currentAction = 'AutenticatingFireFighter';
    this.canReceiveKeyPress = false;
    this.MODAL_AUTENTICACION_BOMBEROS = this.autenticadorBombero.requestBomberoAutentication('Seleccion de Lados',
      (returnResult: RespuestaAutenticacionBombero): void => {
        this.MODAL_AUTENTICACION_BOMBEROS.unsubscribe();
        this.currentAction = 'Nothing';
        this.CanManipulatePump(returnResult, data);
      }, () => {
        this.canReceiveKeyPress = true;
        this.MODAL_AUTENTICACION_BOMBEROS.unsubscribe();
        this.currentAction = 'Nothing';
      }, { idBombero: 0 });
  }
  CanManipulatePump = (rptaBomberoAutenticado: RespuestaAutenticacionBombero, data: ResumenLado): void => {
    const dataBombero: BomberoByLado = new BomberoByLado(rptaBomberoAutenticado.bombero, data.Lado);
    this.VentasService.CanManipulatePump(dataBombero)
      .then(data => {
        if (data.Success) {
          this.SaleManipulationProviderService.emitBomberoYLadoInfo(dataBombero);
          this.SaleManipulationProviderService.ladoSeleccionado = dataBombero.lado;
          this.router.navigate(['/sale-manipulation/sales-selection', dataBombero.lado]);
        } else {
          this.popupProvider.SimpleMessage('Advertencia', data.PossibleError, PopupType.WARNING);
        }
        this.canReceiveKeyPress = true;
      })
      .catch(error => {
        this.canReceiveKeyPress = true;
        this.popupProvider.SimpleMessage('Error consultando permisos del bombero sobre el lado', error, PopupType.ERROR);
      });
  }
  ngOnInit() {
    this.cleanDigits();   
  }
  
  ngOnDestroy(){
    this.keyPressInfoEmitterSubscription.unsubscribe();
    this.dataLadosSubscription.unsubscribe();
  }

  private cleanDigits() {
    sessionStorage.setItem('firstDigit','');
    sessionStorage.setItem('secondDigit','');   
  }  

}
