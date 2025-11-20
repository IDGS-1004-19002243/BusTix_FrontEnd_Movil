// DTOs para eventos basados en la API
export interface Event {
    eventoID: number;
    nombre: string;
    descripcion: string;
    tipoEvento: string;
    fecha: string;
    horaInicio: string;
    recinto: string;
    direccion: string;
    ciudad: string;
    estado: string;
    ubicacionLat: number;
    ubicacionLong: number;
    urlImagen: string;
    estatus: number;
    estatusNombre: string;
    fechaCreacion: string;
    creadoPor: string;
    totalViajes: number;
}

