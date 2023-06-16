import { Component, OnInit,Input } from '@angular/core';
import { BaseResponse } from 'app/commons/base-response.model';
import { BaseService } from 'app/commons/base.service';
import { environment } from 'environments/environment';
import { interval, Subscription } from 'rxjs';
import { TankStatus } from './tank-status.model';
import { startWith, switchMap } from "rxjs/operators";
@Component({
  selector: 'trinity-tank-status',
  templateUrl: './tank-status.component.html',
  styleUrls: ['./tank-status.component.css']
})
export class TankStatusComponent implements OnInit {

  TankStatusFeature:boolean = false;
  data:TankStatus[]=[];
  @Input() EstadoTanques = [];
  subscription: Subscription = new Subscription();
  private readonly URL_MICRO:string;
  constructor(
    private readonly client: BaseService,
 
    ) {
      this.URL_MICRO = environment.Urls.MicroTankStatusApi;
     }
   
  async getTankStatusData(){
    const route = `/GetStatus`;
    try {
      const result = await this.client.Get<BaseResponse<TankStatus[]>>(this.URL_MICRO, route).toPromise();
      this.data = result.data;
    } catch (error) {
      //poner alerta
      console.error("getTankStatusData(): ",error.message);
    }
  }

  getTankStatusDataObservable(){
    const route = `/GetStatus`;
    return this.client.Get<BaseResponse<TankStatus[]>>(this.URL_MICRO, route);
    
  }

  getSubscription(){
      this.subscription.unsubscribe();
      this.subscription = interval(environment.Settings.TankStatusSecondsTimer  * 1000).pipe(
        startWith(0),
        switchMap(()=> this.getTankStatusDataObservable())
      ).subscribe((res)=>{
        this.data = res.data;
      },
      (_err)=>{
        console.error("getTankStatusDataObservable error: ",_err);
        this.subscription.unsubscribe();
        this.TankStatusFeature=false;
      });
  }
  async ngOnInit() {
    this.TankStatusFeature = environment.FeatureFlags.TankStatus;
    if(this.TankStatusFeature){
      this.getSubscription()
    }
  }

  waterQuantity(color:string,valor:number){
    let src = `assets/images/tanques/${color}-type-1/3D`; 
    if(valor <= 0 ){
      return src+"/0.png";
    }
    if(valor > 0 && valor <= 10){
      return src+"/10.png";
    }
    if(valor > 10 && valor <= 20){
      return src+"/20.png";
    }
    if(valor > 20 && valor <= 30){
      return src+"/30.png";
    }
    if(valor > 30  && valor <= 40){
      return src+"/40.png";
    } 
    if(valor > 40 &&  valor <= 50){
      return src+"/50.png";
    } 
    if(valor > 50 &&  valor <= 60){
      return src+"/60.png";
    } 
    if(valor > 60 &&  valor <= 70){
      return src+"/70.png";
    } 
    if(valor > 70 &&  valor <= 80){
      return src+"/80.png";
    } 
    if(valor > 80 &&  valor <= 90){
      return src+"/90.png";
    } 
    if(valor > 90 &&  valor <= 100 || valor > 100){
      return src+"/100.png";
    } 
  }

}
