import { Component, Input, OnInit } from '@angular/core';
import { BaseResponse } from 'app/commons/base-response.model';
import { BaseService } from 'app/commons/base.service';
import { TankStatus } from 'app/components/home/tank-status/tank-status.model';
import { environment } from 'environments/environment';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'complete-tank-status',
  templateUrl: './complete-tank-status.component.html',
  styleUrls: ['./complete-tank-status.component.css']
})
export class CompleteTankStatusComponent implements OnInit {

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
    let src = "assets/images/tanks/"+color; 
    if(valor < 0 || (valor >= 0 && valor < 20)){
      return src+"/10-20.jpg";
    }
    if(valor >= 20 && valor < 40){
      return src+"/30-40.jpg";
    }
    if(valor >= 40  && valor < 60){
      return src+"/50-60.jpg";
    } 
    if(valor >= 60 &&  valor < 80){
      return src+"/70-80.jpg";
    } 
    if(valor >= 80 &&  valor < 100){
      return src+"/90-100.jpg";
    } 
    if(valor >= 100){
      return src+"/90-100.jpg";
    } 
  }

}