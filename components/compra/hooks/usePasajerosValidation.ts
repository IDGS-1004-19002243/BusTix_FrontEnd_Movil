import { useMemo } from 'react';
import { PasajeroData } from '../PasajerosForm';

interface ValidationErrors {
  nombre?: string;
  email?: string;
  telefono?: string;
}

interface PasajerosValidationResult {
  isValid: boolean;
  errors: ValidationErrors[];
}

export const usePasajerosValidation = (pasajeros: PasajeroData[]): PasajerosValidationResult => {
  const validation = useMemo(() => {
    const errors: ValidationErrors[] = [];
    let allValid = true;

    pasajeros.forEach((pasajero, index) => {
      const fieldErrors: ValidationErrors = {};

      // Validar nombre: no vacío
      if (!pasajero.nombre || pasajero.nombre.trim() === '') {
        fieldErrors.nombre = 'El nombre es obligatorio';
        allValid = false;
      }

      // Validar email: formato correcto
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pasajero.email || pasajero.email.trim() === '') {
        fieldErrors.email = 'El email es obligatorio';
        allValid = false;
      } else if (!emailRegex.test(pasajero.email)) {
        fieldErrors.email = 'El email no tiene un formato válido';
        allValid = false;
      }

      // Validar teléfono: numérico y no vacío
      if (!pasajero.telefono || pasajero.telefono.trim() === '') {
        fieldErrors.telefono = 'El teléfono es obligatorio';
        allValid = false;
      } else if (!/^\d+$/.test(pasajero.telefono)) {
        fieldErrors.telefono = 'El teléfono debe contener solo números';
        allValid = false;
      }

      errors[index] = fieldErrors;
    });

    return {
      isValid: allValid,
      errors,
    };
  }, [pasajeros]);

  return validation;
};