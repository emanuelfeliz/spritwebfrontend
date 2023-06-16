import { Component, OnInit } from '@angular/core';
import { CoinRate } from 'app/models/coinRate/coinRate.model';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { CoinRatesService } from 'app/services/coinRates.service';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';

@Component({
  selector: 'app-coin-rates',
  templateUrl: './coin-rates.component.html'
})
export class CoinRatesComponent implements OnInit {
  public coinrate: CoinRate;
  public coinRates: CoinRate[] = [];
  public crear: boolean;
  public loading = false;

  constructor(private coinRatesService: CoinRatesService, private popupProvider: PopupProviderService){
      this.initEntidad();
      this.crear = false;
  }

  initEntidad = (): void => {
      this.coinrate = new CoinRate(0, '', 0);
  }

  guardar = (): void => {
      if(!this.validar()){
          this.popupProvider.SimpleMessage(`Advertencia`, `Todos los campos son obligatorios`, PopupType.WARNING);
          return;
      }

      this.coinRatesService.editCoinRates(this.coinrate).then((response: GenericResponse<CoinRate>) => {
          if(response.Success){
              this.popupProvider.SimpleMessage('Éxito', `Valor moneda actualizada`, PopupType.SUCCESS);
              this.crear = false;
              this.initEntidad();
              this.cargarCoinRate();
          } else {
              this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
          }
      }).catch((response: GenericResponse<CoinRate>) => {
          this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
      });
  }

  cargarCoinRate = () => {
    this.loading = true;
    this.coinRatesService.getCoinRates('')
      .then(
        result => {
          if (result.PossibleError == '') {
            this.coinRates = result.List;
            this.loading = false;
          }
        }
      ).catch(error => {
        console.log(error);
      });
  }

  ngOnInit() {
    this.cargarCoinRate();
  }

  editCoinRate = (coinrate: CoinRate): void => {
      this.coinrate = JSON.parse(JSON.stringify(coinrate));
      this.crear = true;
  }

  deleteCoinRate = (id: number): void => {
      this.coinRatesService.deleteCoinRate(id).then(response => {
          if(response.Success){
              this.popupProvider.SimpleMessage('Éxito', `Moneda eliminada`, PopupType.SUCCESS); 
              this.cargarCoinRate();
          } else {
              this.popupProvider.SimpleMessage(`Advertencia`, `${response.PossibleError}`, PopupType.WARNING);
          }
      }).catch((response: GenericResponse<string>) => {
          this.popupProvider.SimpleMessage(`Error`, `${response.PossibleError}`, PopupType.ERROR);
      });
  }

  confirmar = (coinrate: CoinRate): void => {
      this.popupProvider.QuestionMessage('Eliminar', `Estás seguro de eliminar la Moneda: ${coinrate.CoinName}?`,
          PopupType.WARNING, 'SI!', 'NO!',
          () => {
              this.deleteCoinRate(coinrate.Id);
          }, 
          () => {}
      );
  }

  validar = (): boolean => {
      return this.coinrate.CoinName !== '';
  }


}