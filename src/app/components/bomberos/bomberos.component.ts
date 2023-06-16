import { GenericResponse } from './../../models/GenericResponse.model';
import { Component, OnInit } from '@angular/core';
import { Bombero } from '../../models/bomberos/bomberos.model';
import { BomberosService } from '../../services/bomberos.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { AperturaTurnosService } from '../../services/apertura_turno.service';
import { LadoSelected } from '../../models/apertura_turno/ladoSelected.model';


@Component({
  selector: 'app-bomberos',
  templateUrl: './bomberos.component.html'
})
export class BomberosComponent implements OnInit {

  public bomberos: Bombero[] = [];
  public bombero: Bombero;
  public creando = false;
  public editando = false;
  public textoBoton: string;
  public loading = false;
  public lados: LadoSelected[] = [];

  constructor(private AperturaTurnosService: AperturaTurnosService, private popupProviderService: PopupProviderService,
    private bomberosService: BomberosService, private router: Router) {
    const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError === '') {
      if (responseAuth.Response.bomberos === false) {
        this.router.navigate(['permisodenegado']);
      } else {
        this.bombero = new Bombero(0, '', '', false, false, '');
        this.textoBoton = 'Crear bombero';
        this.cargarLados();
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
        PopupType.ERROR);
    }
  }
  validateModel = (bombero: Bombero): boolean => {
    return bombero.name !== '' && bombero.codigo !== '';
  }
  editarBombero = (bombero: Bombero) => {
    this.creando = false;
    this.editando = true;
    this.textoBoton = 'Cancelar edición';
    this.bombero = bombero;
    const ladosSeleccionados: Array<string> = bombero.lados.split(',');
    ladosSeleccionados.forEach(e => {
      this.lados.forEach(lado => {
        if (lado.Lado.toString() === e) {
          lado.Selected = true;
        }
      });
    });
  }
  botones = () => {
    if (!this.creando && !this.editando) {
      this.creando = true;
      this.bombero = new Bombero(0, '', '', false, false, '');
      this.textoBoton = 'Cancelar';
    } else if (this.creando) {
      this.creando = false;
      this.bombero = new Bombero(0, '', '', false, false, '');
      this.textoBoton = 'Crear bombero';
      this.cargarLados();
    } else if (this.editando) {
      this.editando = false;
      this.bombero = new Bombero(0, '', '', false, false, '');
      this.textoBoton = 'Crear bombero';
      this.cargarLados();
    }
  }
  getLados = (): string => {
    let result: string = '';
    for (let index = 0; index < this.lados.length; index++) {
      if (this.lados[index]['Selected'] === true) {
        result += (result !== '' ? ',' : '') + this.lados[index]['Lado'];
      }
    }
    return result;
  }
  onSubmit = () => {
    if (this.bombero.is_master && this.lados.filter(x => x.Selected == true).length == 0) {
      this.popupProviderService.SimpleMessage('No se puede registrar bombero',
        'Si el bombero es maestro debe seleccionar por lo menos un lado', PopupType.WARNING);
      return;
    }
    this.bombero.lados = this.getLados();
    if (this.creando) {
      this.bomberosService.addBombero(this.bombero)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage('Éxito', 'Bombero agregado',
                PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Bombero no agregado', result.PossibleError,
                PopupType.ERROR);
            }
            this.getBomberos();
            this.cargarLados();
            this.creando = false;
            this.bombero = new Bombero(0, '', '', false, false, '');
            this.textoBoton = 'Crear bombero';
          }).catch(error => {
            console.log(error);
          });
    } else if (this.editando) {
      this.bomberosService.editBombero(this.bombero)
        .then(
          result => {
            if (result.Success) {
              this.popupProviderService.SimpleMessage('Éxito', 'Bombero modificado',
                PopupType.SUCCESS);
            } else {
              this.popupProviderService.SimpleMessage('Bombero no modificado', result.PossibleError,
                PopupType.ERROR);
            }
            this.getBomberos();
            this.cargarLados();
            this.editando = false;
            this.bombero = new Bombero(0, '', '', false, false, '');
            this.textoBoton = 'Crear bombero';
          }
        ).catch(error => {
          console.log(error)
        });
    }
  }
  getBomberos = () => {
    this.loading = true;
    this.bomberosService.getBomberos('')
      .then(
        result => {
          if (result.PossibleError == '') {
            this.bomberos = result.List;
            this.loading = false;
          }
        }
      ).catch(error => {
        console.log(error);
      });
  }
  ngOnInit() {
    this.getBomberos();
  }
  deleteBombero = (bomberoid: number) => {
    this.bomberosService.deleteBombero(bomberoid).then(response => {
      if (response.Success) {
        this.popupProviderService.SimpleMessage('Éxito', 'Bombero eliminado',
          PopupType.SUCCESS);
        this.getBomberos();
      } else {
        this.popupProviderService.SimpleMessage('Bombero no eliminado', 'Algo salió mal!',
          PopupType.ERROR);

      }
    }).catch(error => {
      console.log(error);
    });
  }
  cargarLados = () => {
    this.loading = true;
    this.AperturaTurnosService.cargarLados()
      .then(
        result => {
          if (result.PossibleError === '') {
            this.lados = result.List;
            this.loading = false;
          }
        }).catch(error => {
          this.popupProviderService.SimpleMessage('Apertura Turno', error, PopupType.ERROR);
          this.loading = false;
        });
  }
  confirmarBorrarBombero = (bombero: Bombero) => {

    this.popupProviderService.QuestionMessage('Eliminar bombero', `Estás seguro de eliminar el bombero ${bombero.name}?`,
      PopupType.WARNING, 'SI!', 'NO!',
      () => {
        this.deleteBombero(bombero.id);
      }, () => {
      });
  }
}
