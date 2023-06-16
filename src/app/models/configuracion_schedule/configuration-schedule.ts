export interface ConfigurationSchedule{
     id:number,
     hora_inicio:string,
     hora_fin:string,
     entre_dias:boolean
};

export interface ConfiguracionHorarioTurno extends ConfigurationSchedule{
  turno:number
}