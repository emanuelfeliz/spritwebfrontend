import { Component, OnInit } from '@angular/core';
import { PopupProviderService, PopupType } from 'app/services/popupProvider.service';
import { ConfiguracionTurnosHorariosService } from 'app/services/configuracion-turnos-horarios.service';
import { Router } from '@angular/router';
import { GenericResponse } from 'app/models/GenericResponse.model';
import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
import { ConfiguracionHorarioTurno } from 'app/models/configuracion_schedule/configuration-schedule';

@Component({
    selector: 'configuration-schedule-days-app',
    templateUrl: './configuration-scedule-day.component.html'
})

export class ConfigurationScheduleDaysComponent implements OnInit {
    public configuraciones: ConfiguracionHorarioTurno[] = [];
    public configuracion: ConfiguracionHorarioTurno;
    public creando: boolean = false;
    public editando: boolean = false;
    public textoBoton: string;
    public loading: boolean = false;

    constructor(private popupProviderService: PopupProviderService, private configuracionService: ConfiguracionTurnosHorariosService,
        private router: Router) {
        let responseAuth: GenericResponse<UsuarioAutenticado> = JSON.parse(localStorage.getItem("currentUser"));
        if (responseAuth.PossibleError == "") {
            if (responseAuth.Response.configuracion_horario_turnos == false) {
                this.router.navigate(['permisodenegado']);
            } else {
                this.configuracion = { id: 0, turno: 0, hora_inicio: '', hora_fin: '', entre_dias: false };
                this.textoBoton = "Crear configuración de horario";
            }
        } else {
            this.popupProviderService.SimpleMessage('Sesion Fallida', 'No se puedo obtener la sesión',
                PopupType.ERROR);
        }
    }
    //Metodo para validar el objeto
    validateModel = (configuracion: ConfiguracionHorarioTurno): boolean => {
        return configuracion.turno != 0 && configuracion.hora_inicio != "" && configuracion.hora_fin != "";
    }
    editarConfiguracionHorarioTurno = (configuracion: ConfiguracionHorarioTurno) => {
        this.creando = false;
        this.editando = true;
        this.textoBoton = "Cancelar edición";
        this.configuracion = configuracion;
    }
    botones = () => {
        if (!this.creando && !this.editando) {
            this.creando = true;
            this.configuracion = { id: 0, turno: 0, hora_inicio: '', hora_fin: '', entre_dias: false };
            this.textoBoton = "Cancelar";
        } else if (this.creando) {
            this.creando = false;
            this.configuracion = { id: 0, turno: 0, hora_inicio: '', hora_fin: '', entre_dias: false };
            this.textoBoton = "Crear configuración de horario";
        } else if (this.editando) {
            this.editando = false;
            this.configuracion = { id: 0, turno: 0, hora_inicio: '', hora_fin: '', entre_dias: false };
            this.textoBoton = "Crear configuración de horario";
        }
    }
    onSubmit = () => {
        if (this.creando) {
            this.configuracionService.saveConfiguracionturno(this.configuracion)
                .then(
                    result => {
                        if (result.Success) {
                            this.popupProviderService.SimpleMessage(
                                'Éxito',
                                'Configuración de horario agregada',
                                PopupType.SUCCESS
                            );
                            this.getConfiguraciones();
                        } else {
                            this.popupProviderService.SimpleMessage(
                                'Configuración de horario no agregada',
                                `Error (${result.Response})`,
                                PopupType.ERROR
                            );
                        }
                        this.creando = false;
                        this.textoBoton = "Crear configuración de horario";
                    }).catch(error => {
                        this.popupProviderService.SimpleMessage('Configuracion de horario', error,
                            PopupType.ERROR);
                    });
        } else if (this.editando) {
            this.configuracionService.editConfiguracionturno(this.configuracion)
                .then(
                    result => {
                        if (result.Success) {
                            this.popupProviderService.SimpleMessage(
                                'Éxito',
                                'Configuración modificada',
                                PopupType.SUCCESS
                            );
                            this.getConfiguraciones();
                        } else {
                            this.popupProviderService.SimpleMessage(
                                'Configuración no modificada',
                                'Algo salió mal!',
                                PopupType.ERROR
                            );
                        }
                        this.editando = false;
                        this.textoBoton = "Crear configuración de horario";
                    }).catch(error => {
                        this.popupProviderService.SimpleMessage(
                            'Configuración no modificada',
                            error,
                            PopupType.ERROR
                        );
                    });
        }
    }
    getConfiguraciones = () => {
        this.loading = true;
        this.configuracionService.getConfiguracionHorarioTurnos()
            .then(
                result => {
                    if (result.PossibleError == "") {
                        this.configuraciones = result.List;
                        this.loading = false;

                    }
                }).catch(error => {
                    this.popupProviderService.SimpleMessage('Configuracin Horarios turnos', error,
                        PopupType.ERROR);
                });
    }
    ngOnInit() {
        this.getConfiguraciones();
    }
    deleteConfiguracion = (id: number) => {
        this.configuracionService.deleteConfiguracionturno(id).then(response => {
            if (response.Success) {
                this.popupProviderService.SimpleMessage(
                    'Éxito',
                    'Configuración de Horario eliminada',
                    PopupType.SUCCESS
                );
                this.getConfiguraciones();
            } else {
                this.popupProviderService.SimpleMessage(
                    'Configuración de Horario no eliminada',
                    'Algo salió mal!',
                    PopupType.ERROR
                );
            }
        }).catch(error => {
            this.popupProviderService.SimpleMessage(
                'Configuración de Horario no eliminada',
                error,
                PopupType.ERROR
            );
        });
    }
    confirmarBorrarConfiguracionHorarioTurno = (configuracion: ConfiguracionHorarioTurno) => {
        this.popupProviderService.QuestionMessage('Eliminar configuración',
            `Estás seguro de eliminar la configuración del turno ${configuracion.turno}?`,
            PopupType.WARNING, 'SI!', 'NO!',
            () => {
                this.deleteConfiguracion(configuracion.id);
            }, () => {
            });
    }

}