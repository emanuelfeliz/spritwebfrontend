import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router } from '@angular/router';
import { VentasService } from '../../../services/ventas.service';
import { Venta } from '../../../models/listado-ventas/venta.model';

@Injectable({
  providedIn: 'root'
})
export class SalesSelectionResolverService implements Resolve<Array<Venta>>{

  constructor(private router: Router, private VentasService: VentasService) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Array<Venta> | any {
    const pump: number = Number(route.paramMap.get('pump'));
    return this.VentasService.LoadSalesByPump(pump)
      .then(data => {
        if (data.PossibleError === '') {
          return data.List;
        } else {
          this.router.navigate(['/sale-manipulation/pump-selection']);
          return null;
        }
      });
  }
}
