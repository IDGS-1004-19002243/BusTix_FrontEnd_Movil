import { useMemo } from 'react';

export interface ProfileFormData {
  nombreCompleto: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
}

interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const useProfileValidation = (formData: ProfileFormData): ProfileValidationResult => {
  const validation = useMemo(() => {
    if (!formData) {
      return { isValid: false, errors: {} };
    }
    const errors: Record<string, string> = {};
    let allValid = true;

    // Validar nombre completo: no vacío
    if (!formData.nombreCompleto || formData.nombreCompleto.trim() === '') {
      errors.nombreCompleto = 'El nombre completo es obligatorio';
      allValid = false;
    }

    // Validar teléfono: numérico, 10 dígitos y no vacío
    if (!formData.telefono || formData.telefono.trim() === '') {
      errors.telefono = 'El teléfono es obligatorio';
      allValid = false;
    } else if (!/^\d+$/.test(formData.telefono)) {
      errors.telefono = 'El teléfono debe contener solo números';
      allValid = false;
    } else if (formData.telefono.length !== 10) {
      errors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
      allValid = false;
    }

    // Validar dirección: no vacío
    if (!formData.direccion || formData.direccion.trim() === '') {
      errors.direccion = 'La dirección es obligatoria';
      allValid = false;
    }

    // Validar ciudad: no vacío
    if (!formData.ciudad || formData.ciudad.trim() === '') {
      errors.ciudad = 'La ciudad es obligatoria';
      allValid = false;
    }

    // Validar estado: no vacío
    if (!formData.estado || formData.estado.trim() === '') {
      errors.estado = 'El estado es obligatorio';
      allValid = false;
    }

    // Validar código postal: no vacío
    if (!formData.codigoPostal || formData.codigoPostal.trim() === '') {
      errors.codigoPostal = 'El código postal es obligatorio';
      allValid = false;
    }

    return {
      isValid: allValid,
      errors,
    };
  }, [formData]);

  return validation;
};