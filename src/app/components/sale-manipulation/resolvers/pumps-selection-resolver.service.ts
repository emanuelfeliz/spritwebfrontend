import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PumptabletService } from '../../../services/pumptablet.service';
import { ResumenLado } from '../../../models/pump-tablet/resumen_lado.model';

@Injectable({
  providedIn: 'root'
})
export class PumpsSelectionResolverService implements Resolve<Array<ResumenLado>> {

  constructor(private pumpTabletService: PumptabletService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Array<ResumenLado> | any {
    return this.pumpTabletService.getResumenesLados()
      .then(data => {
        if (data.PossibleError === '') {
          return data.List;
        } else {
          this.router.navigate(['/sale-manipulation/pumps-selection']);
          return null;
        }
      })
  }
}
