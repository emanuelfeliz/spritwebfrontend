import { Component, OnInit } from '@angular/core';
import { ComprobantesService } from '../../services/comprobantes.service';
import { RncModel } from '../../models/conf-comprobantes/RncModel.model';
import { PopupProviderService, PopupType } from '../../services/popupProvider.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-rnc',
  templateUrl: './new-rnc.component.html'
})
export class NewRncComponent implements OnInit {

  rncModel: RncModel;
  constructor(private ComprobantesService: ComprobantesService,
    private popup: PopupProviderService,
    private router: Router) {
    this.rncModel = new RncModel('', '', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }
  onSubmit() {
    if (this.rncModel.rnc === '' || this.rncModel.nombre_razon_social === '' || this.rncModel.nombre_comercial === '') {
      this.popup.SimpleMessage('Validacion', 'Debe completar los campos', PopupType.WARNING);
      return;
    }
    this.ComprobantesService.SaveNewRnc(this.rncModel)
      .then(data => {
        if (data.Success) {
          this.popup.SimpleMessage('Exito', 'Rnc registrado', PopupType.SUCCESS);
          this.rncModel = new RncModel('', '', '', '', '', '', '', '', '');
          setTimeout(() => {
            this.router.navigate(['/listadoVentas']);
          }, 2500);
        } else {
          this.popup.SimpleMessage('Rnc no registrado', data.PossibleError, PopupType.WARNING);
        }
      }).catch(err => this.popup.SimpleMessage('Error al registrar el rnc', err, PopupType.ERROR));
  }

}
