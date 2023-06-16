import { UsuarioAutenticado } from 'app/models/usuarios/UsuarioAutenticado.model';
export class RespuestaAutenticacionUsuario{
    public constructor(
        public usuario:UsuarioAutenticado,
        public respuesta:string
    ){}
}