import { UsuarioAutenticado } from './models/usuarios/UsuarioAutenticado.model';
import { GenericResponse } from './models/GenericResponse.model';
import { AuthenticationService } from './services/authentication.service';
import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEventsManager } from 'app/services/GlobalEventsManager.service';
declare var $;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  showNavBar:boolean=false;
  private idleTime:number;
  ngOnInit(): void {
    this.idleTime = 0;
    $(document).mousemove((e)=> {
      this.idleTime = 0;
    });
    $(document).keypress((e)=> {
      this.idleTime = 0;
    });
    setInterval(() => {
      const responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem('currentUser'));
      if (responseAuth !== null && responseAuth.PossibleError === ''){
        if (responseAuth.Response.expiracion_sesion !== 0){
          this.idleTime = this.idleTime + 1;
          if (this.idleTime >= Number(responseAuth.Response.expiracion_sesion)) {
            this.AuthenticationService.logout();
            this.router.navigate(['/login']);
          }
        }
      }else{
        this.AuthenticationService.logout();
        this.router.navigate(['/login']);
      }
    }, 60000);
  }
  constructor(private router:Router,private AuthenticationService:AuthenticationService,private GlobalEventsManager:GlobalEventsManager){
    this.GlobalEventsManager.showNavBarEmitter.subscribe(
      (mode)=>{
        this.showNavBar=mode;
      }
    );
  }
}
