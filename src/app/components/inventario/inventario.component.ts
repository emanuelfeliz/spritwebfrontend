import { Component, OnInit } from '@angular/core';
import { Inventario } from '../../models/inventario/inventario.model';
import { EntryService } from '../../services/entry.service';
import { UsuarioAutenticado } from '../../models/usuarios/UsuarioAutenticado.model';
import { Router } from '@angular/router';
import { GenericResponse } from '../../models/GenericResponse.model';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html'
})
export class InventarioComponent implements OnInit {

  constructor(private popupProviderService: PopupProviderService,private entryService: EntryService, private router: Router) {
    let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
    if (responseAuth.PossibleError == '') {
      if (responseAuth.Response.inventario == false) {
        this.router.navigate(['permisodenegado']);
      }
    } else {
      this.popupProviderService.SimpleMessage('Sesion Fallidad', 'No se puedo obtener la sesión', PopupType.ERROR);
    }
  }
  public loading: boolean = false;
  public inventarios: Array<Inventario>;
  getInventario = () => {
    this.loading = true;
    this.entryService.getInventario().then(
      result => {
        if (result.PossibleError == '') {
          this.inventarios = result.List;
          this.loading = false;

        }
      }).catch(error => {
        this.popupProviderService.SimpleMessage('Entry', error, PopupType.ERROR);
      });
  }
  ngOnInit() {
    this.getInventario();
  }

}
