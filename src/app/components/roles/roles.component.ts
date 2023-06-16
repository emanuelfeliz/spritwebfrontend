import { Component, OnInit } from '@angular/core';
import { GenericResponse } from './../../models/GenericResponse.model';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Rol } from '../../models/usuarios/Rol.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {
  roles: Rol[] = [];
  rol: Rol;
  creando = false;
  editando = false;
  textoBoton: string;
  loading = false;
  mP: Array<string> = [];
  mD: Array<string> = [];
  constructor(private popupProviderService: PopupProviderService,
    private authenticationService: AuthenticationService, private router: Router) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.roles == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.resetRol();
        this.textoBoton = 'Crear rol';
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', "No se puedo obtener la sesión", PopupType.ERROR);
    }
  }
  validateModel = (rol: Rol): boolean => {
    return rol.nombre !== '';
  }
  editarRol = (rol: Rol) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = "Cancelar edición";
    this.rol = rol;
  }
  resetRol = (): void => {
    this.rol = new Rol(0, '', false, "0", false, false, false, false, false, false, "0", false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, 0, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
      false, false, false, false, false, false, false, false, false, false, false, false,false, false, false, false,false,false,false);
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.resetRol();
      this.textoBoton = "Cancelar";
    } else if (this.creando) {
      this.creando = false;
      this.resetRol();
      this.textoBoton = "Crear rol";
    } else if (this.editando) {
      this.editando = false;
      this.resetRol();
      this.textoBoton = "Crear rol";
    }
  }
  onSubmit = () => {
    if (this.creando) {
      this.authenticationService.saveRol(this.rol)
        .then(result => {
          if (result.Success) {
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Rol agregado',
              PopupType.SUCCESS
            );
            this.getRoles();
          } else {
            this.popupProviderService.SimpleMessage(
              'Rol no agregado',
              result.PossibleError,
              PopupType.ERROR
            );
          }
          this.creando = false;
          this.textoBoton = "Crear rol";
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
        });
    } else if (this.editando) {
      this.authenticationService.editRol(this.rol)
        .then(result => {
          if (result.Success) {
            this.popupProviderService.SimpleMessage(
              'Éxito',
              'Rol modificado',
              PopupType.SUCCESS
            );
            this.getRoles();
          } else {
            this.popupProviderService.SimpleMessage(
              'Rol no modificado',
              result.PossibleError,
              PopupType.ERROR
            );
          }
          this.editando = false;
          this.textoBoton = 'Crear rol';
        })
        .catch(error => {
          this.popupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
        });
    }

  }

  modulosDenegados = (rol: Rol): void => {
    this.mD = [];
    for (const key in rol) {
      if (key != 'id' && key != 'expiracion_sesion' && key != 'nombre') {
        if (typeof (rol[key]) === 'boolean' && rol[key] == false) {
          this.mD.push(key);
        }
        if (typeof (rol[key]) === 'string' && String(rol[key]) != '0') {
          this.mD.push(key);
        }
      }
    }
  }
  modulosPermitidos = (rol: Rol): void => {
    this.mP = [];
    for (const key in rol) {
      if (key !== 'id' && key !== 'expiracion_sesion' && key !== 'nombre') {
        if (typeof (rol[key]) === 'boolean' && rol[key] === true) {
          this.mP.push(key);
        }
        if (typeof (rol[key]) === 'string' && String(rol[key]) === '0') {
          this.mP.push(key);
        }
      }
    }
  }
  getRoles = () => {
    this.loading = true;
    this.authenticationService.getRoles()
      .then(data => {
        if (data.PossibleError === '') {
          this.roles = data.List;
          console.log(data.List);
        }
        this.loading = false;
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage('Error interno', error, PopupType.ERROR);
        this.loading = false;
      });
  }
  ngOnInit() {
    this.getRoles();
  }
  deleteRol = (rolid: number) => {
    this.authenticationService.deleteRol(rolid)
      .then(data => {
        if (data.Success) {
          this.popupProviderService.SimpleMessage(
            'Éxito',
            'Rol eliminado',
            PopupType.SUCCESS
          );
          this.getRoles();
        } else {
          this.popupProviderService.SimpleMessage(
            'Rol no eliminado',
            'Algo salió mal!',
            PopupType.ERROR
          );
        }
      })
      .catch(error => {
        this.popupProviderService.SimpleMessage(
          'Error interno',
          error,
          PopupType.ERROR
        );
      });
  }
  confirmarBorrarRol = (rol: Rol) => {
    this.popupProviderService.QuestionMessage('Eliminar rol', `Estás seguro de eliminar el rol ${rol.nombre}?`,
      PopupType.WARNING, 'SI!', 'NO'!,
      () => {
        this.deleteRol(rol.id);
      }, () => {
      });
  }
}
