export interface Viaje {
  viajeID: number;
  codigoViaje: string;
  tipoViaje: string;
  eventoID: number;
  eventoNombre: string;
  eventoFecha: string;
  plantillaRutaID: number;
  rutaNombre: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  unidadID: number;
  unidadPlacas: string;
  unidadModelo: string;
  choferID: string;
  choferNombre: string;
  fechaSalida: string;
  fechaLlegadaEstimada: string;
  cupoTotal: number;
  asientosDisponibles: number;
  asientosVendidos: number;
  precioBase: number;
  cargoServicio: number;
  ventasAbiertas: boolean;
  estatus: number;
  estatusNombre: string;
  fechaCreacion: string;
  totalParadas: number;
  totalStaff: number;
  totalIncidencias: number;
}

export interface Parada {
  paradaViajeID: number;
  nombreParada: string;
  direccion: string;
  latitud: number;
  longitud: number;
  ordenParada: number;
  horaEstimadaLlegada: string | null;
  tiempoEsperaMinutos: number;
  precioBase: number;
  cargoServicio: number;
  precioTotal: number;
  iva: number;
  totalAPagar: number;
  asientosDisponibles: number;
  tieneDisponibilidad: boolean;
}

export interface ViajeDetalleCliente {
  viajeID: number;
  codigoViaje: string;
  tipoViaje: string;
  eventoID: number;
  eventoNombre: string;
  eventoDescripcion: string;
  eventoFecha: string;
  eventoRecinto: string;
  eventoCiudad: string;
  eventoUrlImagen: string;
  rutaNombre: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  fechaSalida: string;
  fechaLlegadaEstimada: string;
  duracionEstimadaHoras: number;
  cupoTotal: number;
  asientosDisponibles: number;
  asientosVendidos: number;
  porcentajeOcupacion: number;
  ventasAbiertas: boolean;
  precioBase: number;
  cargoServicio: number;
  precioDesde: number;
  precioHasta: number;
  unidadModelo: string;
  unidadPlacas: string;
  capacidadUnidad: number;
  choferNombre: string;
  paradas: Parada[];
  observaciones: string | null;
  tieneServicioWifi: boolean;
  tieneAireAcondicionado: boolean;
  tieneBaño: boolean;
}

export interface CalculoPrecioDto {
  viajeID: number;
  codigoViaje: string;
  ciudadOrigen: string;
  ciudadDestino: string;
  fechaSalida: string;
  precioBase: number;
  cargoServicio: number;
  descuento: number;
  descuentoPorcentaje: number;
  subtotal: number;
  iva: number;
  precioTotal: number;
  cuponAplicado: string | null;
  ventasAbiertas: boolean;
  asientosDisponibles: number;
}