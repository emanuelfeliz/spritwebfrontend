import { Component, OnInit } from '@angular/core';
import { GenericResponse } from './../../models/GenericResponse.model';
import { Usuario } from '../../models/usuarios/Usuario.model';
import { ModelList } from '../../models/ModelList.model';
import { AuthenticationService } from '../../services/authentication.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { Rol } from '../../models/usuarios/Rol.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
declare var $;
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  public users: Usuario[] = [];
  public user: Usuario;
  public roles: Rol[] = [];
  public creando: boolean = false;
  public editando: boolean = false;
  public textoBoton: string;
  public loading: boolean = false;
  constructor(private popupProviderService: PopupProviderService, private authService: AuthenticationService, private router: Router) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.usuarios == false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.user = new Usuario('', '', '', 0, '','');
        this.textoBoton = 'Crear usuario';
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  //Metodo para validar el objeto
  validateModel = (usuario: Usuario): boolean => {
    return usuario.idrol != 0 && usuario.clave != '' && usuario.usuario != '' && usuario.codigo!='';
  }
  editarUsuario = (usuario: Usuario) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = 'Cancelar edición';
    this.user = usuario;
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.user = new Usuario('', '', '', 0, '','');
      this.textoBoton = 'Cancelar';
    } else if (this.creando) {
      this.creando = false;
      this.user = new Usuario('', '', '', 0, '','');
      this.textoBoton = 'Crear usuario';
    } else if (this.editando) {
      this.editando = false;
      this.user = new Usuario('', '', '', 0, '','');
      this.textoBoton = 'Crear usuario';
    }
  }
  onSubmit = () => {
    if (this.creando) {
      this.authService.saveUser(this.user)
      .then(data=>{
        if (data.Success) {
          this.popupProviderService.SimpleMessage(
            'Éxito',
            'Usuario agregado',
            PopupType.SUCCESS
          );
          this.getUsers();
        } else {
          if(data.PossibleError.includes('duplicate key value')){
            this.popupProviderService.SimpleMessage(
              'Usuario no agregado',
              'Ese código ya lo tiene asignado otro usuario',
              PopupType.ERROR
            );
          }else{
            this.popupProviderService.SimpleMessage(
              'Usuario no agregado',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }          
        }
        this.creando = false;
        this.textoBoton = 'Crear usuario';
      })
      .catch(error=>{
        this.popupProviderService.SimpleMessage(
          'Error interno',
          error,
          PopupType.ERROR
        );
      });
    } else if (this.editando) {
      this.authService.editUsuario(this.user)
      .then(data=>{
        if (data.Success) {
          this.popupProviderService.SimpleMessage(
            'Éxito',
            'Usuario modificado',
            PopupType.SUCCESS
          );
          this.getUsers();
        } else {
          if(data.PossibleError.includes('duplicate key value')){
            this.popupProviderService.SimpleMessage(
              'Usuario no modificado',
              'Ese código ya lo tiene asignado otro usuario',
              PopupType.ERROR
            );
          }else{
            this.popupProviderService.SimpleMessage(
              'Usuario no modificado',
              'Algo salió mal!',
              PopupType.ERROR
            );
          }    
        }
        this.editando = false;
        this.textoBoton = 'Crear usuario';
      })
      .catch(error=>{
        this.popupProviderService.SimpleMessage(
          'Error interno',
          error,
          PopupType.ERROR
        );
      });
    }
  }
  getUsers = () => {
    this.loading = true;
    this.authService.getUsuarios()
    .then(data=>{
      if (data.PossibleError == '') {
        this.users = data.List;
      }
      this.loading = false;
    })
    .catch(error=>{
      this.popupProviderService.SimpleMessage('Error interno',error,PopupType.ERROR);
      this.loading = false;
    });
  }
  getRoles = () => {
    this.loading = true;
    this.authService.getRoles()
    .then(data=>{
      if (data.PossibleError == '') {
        this.roles = data.List;
      }
      this.loading = false;
    })
    .catch(error=>{
      this.popupProviderService.SimpleMessage('Error interno',error,PopupType.ERROR);
      this.loading = false;
    });
  }
  ngOnInit() {
    this.getUsers();
    this.getRoles();
  }
  deleteUsuario = (userid: string) => {
    this.authService.deleteUsuario(userid)
    .then(data=>{
      if (data.Success) {
        this.popupProviderService.SimpleMessage(
          'Éxito',
          'Usuario eliminado',
          PopupType.SUCCESS
        );
        this.getUsers();
      } else {
        this.popupProviderService.SimpleMessage(
          'Usuario no eliminado',
          'Algo salió mal!',
          PopupType.ERROR
        );
      }
    })
    .catch(error=>{
      this.popupProviderService.SimpleMessage('Error interno',error,PopupType.ERROR);
    });
  }
  confirmarBorrarUsuario = (usuario: Usuario) => {

    this.popupProviderService.QuestionMessage('Eliminar usuario', `Estás seguro de eliminar el usuario ${usuario.usuario}?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteUsuario(usuario.idusuario);
      }, () => {
      });
  }
}
