// Función para formatear fechas en español
export const formatDate = (dateString: string) => {
  // Crea un objeto Date con la cadena de fecha recibida (ej: "2023-11-15")
  const date = new Date(dateString);
  // Devuelve la fecha formateada en español: día numérico y mes corto (ej: "15 nov")
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });
};

// Función para formatear fechas detalladas en español (para detalles de evento)
export const formatDateDetail = (dateString: string) => {
  // Crea un objeto Date con la cadena de fecha recibida (ej: "2023-11-15")
  const date = new Date(dateString);
  // Devuelve la fecha formateada en español: día, mes largo y año (ej: "15 de noviembre de 2023")
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Función para obtener el color de una categoría de evento
export const getCategoryColor = (category: string) => {
  // Mapa de categorías a colores (ej: 'Concierto' → 'success')
  const colors: Record<string, 'success' | 'info' | 'warning' | 'error' | 'muted'> = {
    'Concierto': 'success', // Verde para conciertos
    'Teatro': 'info',       // Azul para teatro
    'Deportivo': 'warning', // Amarillo para deportes
    'Festival': 'error',    // Rojo para festivales
  };
  // Devuelve el color de la categoría o 'muted' si no está en el mapa (ej: 'Concierto' → 'success')
  return colors[category] || 'muted';
};

// Función para calcular la configuración de la cuadrícula (columnas y ancho de tarjetas)
export const getGridConfig = (width: number, isMobile: boolean) => {
  // Define el espacio entre tarjetas (12 píxeles)
  const gap = 12;

  // Si es móvil (isMobile = true), usa 1 columna
  if (isMobile) {
    // Calcula el ancho disponible restando padding (ej: width=400 → 400-32=368px)
    const containerWidth = width - 32;
    // El ancho de la tarjeta es el menor entre el disponible y 320px (ej: Math.min(368, 320) = 320)
    const cardWidth = Math.min(containerWidth, 320);
    // Devuelve objeto con 1 columna y el ancho calculado
    return { columns: 1, cardWidth };
  }

  // Para desktop, determina el número de columnas según el ancho de pantalla
  let columns = 3; // Por defecto 3 columnas
  if (width > 1200) columns = 4; // Si width > 1200, usa 4 columnas (ej: width=1300 → 4)
  else if (width > 900) columns = 3; // Si 900 < width ≤ 1200, 3 columnas (ej: width=1000 → 3)
  else columns = 2; // Si width ≤ 900, 2 columnas (ej: width=800 → 2)

  // Calcula el ancho disponible restando padding (ej: width=1000 → 1000-32=968px)
  const containerWidth = width - 32;
  // Define el ancho máximo por tarjeta (320px para no ser demasiado anchas)
  const maxCardWidth = 320;

  // Calcula el ancho de cada tarjeta:
  // Espacio para tarjetas = ancho disponible - espacios entre ellas
  // Espacios = gap * (columnas - 1)  [ej: 3 columnas → 2 gaps → 12*2=24px]
  // Ancho por tarjeta = (968 - 24) / 3 ≈ 314.67px
  const cardWidth = (containerWidth - (gap * (columns - 1))) / columns;

  // Limita el ancho al máximo si es necesario (ej: Math.min(314.67, 320) = 314.67)
  const finalCardWidth = Math.min(cardWidth, maxCardWidth);

  // Devuelve objeto con columnas y ancho final (ej: { columns: 3, cardWidth: 314.67 })
  return { columns, cardWidth: finalCardWidth };
};