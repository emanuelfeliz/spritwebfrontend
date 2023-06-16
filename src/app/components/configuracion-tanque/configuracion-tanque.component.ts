import { Component, OnInit } from '@angular/core';
import { ConfiguracionTanque } from 'app/models/configuracion-tanque/configuracion-tanque.model';
import { ConfiguracionTanqueService } from 'app/services/configuracion-tanque.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';

@Component({
  selector: 'app-configuracion-tanque',
  templateUrl: './configuracion-tanque.component.html'
})
export class ConfiguracionTanqueComponent implements OnInit {

  public configuraciones: ConfiguracionTanque[] = [];
  public configuracion: ConfiguracionTanque;
  public creando: boolean = false;
  public editando: boolean = false;
  public textoBoton: string;
  public loading: boolean = false;

  constructor(private popupProviderService: PopupProviderService, private configuracionService: ConfiguracionTanqueService) {
        this.configuracion = { Id: 0, LlenarEnCero: false, PortName: '', TanksQuantity: 0, DataBits: 0, Parity: 0 };
        this.textoBoton = "Crear configuración de tanque";
  }

  //Metodo para validar el objeto
  validateModel=(configuracion:ConfiguracionTanque):boolean=>{
    return configuracion.PortName != "" && configuracion.TanksQuantity != 0;
  }
  editarConfiguracionTanque=(configuracion:ConfiguracionTanque)=>{
    this.creando=false;
    this.editando=true;
    this.textoBoton="Cancelar edición";
    this.configuracion=configuracion;
  }
  botones=()=>{
    if(!this.creando && !this.editando){
      this.creando=true;
      this.configuracion = { Id: 0, LlenarEnCero: false, PortName: '', TanksQuantity: 0, DataBits: 0, Parity: 0 };
      this.textoBoton="Cancelar";
    }else if(this.creando){
      this.creando=false;
      this.configuracion = { Id: 0, LlenarEnCero: false, PortName: '', TanksQuantity: 0, DataBits: 0, Parity: 0 };
      this.textoBoton="Crear configuración de tanque";
    }else if(this.editando){
      this.editando=false;
     this.configuracion = { Id: 0, LlenarEnCero: false, PortName: '', TanksQuantity: 0, DataBits: 0, Parity: 0 }; 
     this.textoBoton="Crear configuración de tanque";
    }
  }
  onSubmit=()=>{
    if(this.creando){
      this.configuracionService.saveConfiguracionTanque(this.configuracion)
      .then(
        result=>{
          if(result.Success){
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Configuración de Tanque agregada',
              PopupType.SUCCESS
            );
            this.getConfiguraciones();
          }else{
            this.popupProviderService.SimpleMessage(
              'Configuración de Tanque no agregada',
              `Error (${result.Response})`,
              PopupType.ERROR
            );
          }
          this.creando=false;
          this.textoBoton="Crear configuración de tanque";
        }).catch(error=>
          {
            this.popupProviderService.SimpleMessage('Configuracion de tanque',error, 
            PopupType.ERROR);
          });
    }else if(this.editando){
      this.configuracionService.editConfiguracionTanque(this.configuracion)
      .then(
        result=>{
          if(result.Success){
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Configuración modificada',
              PopupType.SUCCESS
            );
            this.getConfiguraciones();
          }else{
            this.popupProviderService.SimpleMessage(
              'Configuración no modificada',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }
          this.editando=false;
          this.textoBoton="Crear configuración de tanque";
        }).catch(error=>
          {
            this.popupProviderService.SimpleMessage(
              'Configuración no modificada',
              error,
              PopupType.ERROR
            );
          });
    }
  }
  getConfiguraciones=()=>{
    this.loading=true;
    this.configuracionService.getConfiguracionTanque()
    .then(
      result=>{
        if(result.PossibleError==""){
          this.configuraciones=result.List;
          this.loading=false;
    
        }
      }).catch(error=>
        {
          this.popupProviderService.SimpleMessage('Configuracin De Tanques', error, 
          PopupType.ERROR);
        });
  }
  ngOnInit() {
    this.getConfiguraciones();
  }
  deleteConfiguracion=(id:number)=>{
    this.configuracionService.deleteConfiguracionTanque(id).then(response=>{
      if(response.Success){
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Configuración de tanque eliminada',
          PopupType.SUCCESS
        );
        this.getConfiguraciones();
      }else{
        this.popupProviderService.SimpleMessage(
          'Configuración de tanque no eliminada',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    }).catch(error=>
      {
        this.popupProviderService.SimpleMessage(
          'Configuración de tanque no eliminada',
          error,
          PopupType.ERROR
        );
      });
  }
  confirmarBorrarConfiguracionTanque=(configuracion:ConfiguracionTanque)=>{
    this.popupProviderService.QuestionMessage('Eliminar configuración',
    `Estás seguro de eliminar la configuración del tanque ${configuracion.PortName}?`,
    PopupType.WARNING, 'SI!', 'NO!',
    () => {
      this.deleteConfiguracion(configuracion.Id);
    }, () => {
    });
  }

}
