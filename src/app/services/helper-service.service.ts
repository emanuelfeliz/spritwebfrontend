import { Injectable } from '@angular/core';
import { ModelList } from '../models/ModelList.model';
import { GenericResponse } from '../models/GenericResponse.model';
import { PopupProviderService, PopupType } from './popupProvider.service';
import { UsuarioAutenticado } from '../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';

@Injectable()
export class HelperServiceService {

  constructor(private router: Router, private popupProvider: PopupProviderService) { }

  public getTimeConfiguration = (esLocale): {} => {
    return {
      firstDayOfWeek: 1,
      dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
        'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      dateFns: esLocale
    };
  }
  public loadAuthInfo = (dataExternal: {
    responseAuth: GenericResponse<UsuarioAutenticado>
  }, permiso: string, successCallback: () => void): void => {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response[permiso] === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        dataExternal.responseAuth = responseAuth;
        successCallback();
      }
    } else {
      this.popupProvider.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
        PopupType.ERROR);
    }
  }
  public Delete = (dataExternal: { modelText: string },
    deleteDataCallBack: Promise<GenericResponse<string>>,
    successCallback: () => void): void => {
    deleteDataCallBack.then(data => {
      if (data.Success) {
        this.popupProvider.SimpleMessage('Éxito', `${dataExternal.modelText} eliminado`,
          PopupType.SUCCESS);
        successCallback();
      } else {
        this.popupProvider.SimpleMessage(`${dataExternal.modelText} no eliminado`, 'Algo salió mal!',
          PopupType.WARNING);
      }
    }).catch(error => {
      this.popupProvider.SimpleMessage(`${dataExternal.modelText} no eliminado`, error,
        PopupType.ERROR);
    });
  }
  public SaveAndUpdate = <T>(dataExternal: {
    creando: boolean,
    editando: boolean,
    modelText: string
  }, saveDataCallBack: (model: T) => Promise<GenericResponse<string>>,
    editDataCallBack: (model: T) => Promise<GenericResponse<string>>,
    model: T,
    successCallback: () => void): void => {
    if (dataExternal.creando) {
      saveDataCallBack(model).then(data => {
        if (data.Success) {
          this.popupProvider.SimpleMessage('Éxito', `${dataExternal.modelText} agregado`,
            PopupType.SUCCESS);
          successCallback();
        } else {
          this.popupProvider.SimpleMessage(`${dataExternal.modelText} no agregado`, data.PossibleError,
            PopupType.WARNING);
        }
      }).catch(error => {
        this.popupProvider.SimpleMessage(`${dataExternal.modelText} no agregado`, error,
          PopupType.ERROR);
      });
    } else if (dataExternal.editando) {
      editDataCallBack(model).then(data => {
        if (data.Success) {
          this.popupProvider.SimpleMessage('Éxito', `${dataExternal.modelText} editado`,
            PopupType.SUCCESS);
          successCallback();
        } else {
          this.popupProvider.SimpleMessage(`${dataExternal.modelText} no editado`, data.PossibleError,
            PopupType.WARNING);
        }
      }).catch(error => {
        this.popupProvider.SimpleMessage(`${dataExternal.modelText} no editado`, error,
          PopupType.ERROR);
      });
    }
  }
  public loadModelList = <T>(dataExternal: { list: Array<T>, showLoading: boolean, total: number }, getDataCallBack: Promise<ModelList<T>>)
    : Promise<ModelList<T>> => {
    return new Promise((resolve, reject) => {
      dataExternal.showLoading = true;
      getDataCallBack.then(data => {
        dataExternal.showLoading = false;
        if (data.PossibleError === '') {
          dataExternal.list = data.List;
          dataExternal.total = data.TotalRecords;
          resolve(data);
        } else {
          reject(data.PossibleError);
        }
      }).catch(error => {
        dataExternal.showLoading = false;
        reject(error);
      });
    });
  }
}
