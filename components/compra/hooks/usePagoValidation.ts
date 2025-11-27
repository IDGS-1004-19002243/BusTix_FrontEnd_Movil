import { useMemo } from 'react';

interface PagoData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
}

interface ValidationErrors {
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  expiry?: string;
  cvv?: string;
  name?: string;
}

interface PagoValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

export const usePagoValidation = (pagoData: PagoData): PagoValidationResult => {
  const validation = useMemo(() => {
    const errors: ValidationErrors = {};
    let allValid = true;

    // Validar nombre: no vacío
    if (!pagoData.name || pagoData.name.trim() === '') {
      errors.name = 'El nombre es obligatorio';
      allValid = false;
    }

    // Validar número de tarjeta: 16 dígitos numéricos
    if (!pagoData.cardNumber || pagoData.cardNumber.trim() === '') {
      errors.cardNumber = 'El número de tarjeta es obligatorio';
      allValid = false;
    } else {
      const cleanCardNumber = pagoData.cardNumber.replace(/\s/g, '');
      if (!/^\d+$/.test(cleanCardNumber)) {
        errors.cardNumber = 'El número de tarjeta debe contener solo números';
        allValid = false;
      } else if (cleanCardNumber.length !== 16) {
        errors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
        allValid = false;
      }
    }

    // Validar fecha de expiración: mes y año por separado
    if (!pagoData.expiryMonth || pagoData.expiryMonth.trim() === '') {
      errors.expiryMonth = 'El mes es obligatorio';
      allValid = false;
    }
    if (!pagoData.expiryYear || pagoData.expiryYear.trim() === '') {
      errors.expiryYear = 'El año es obligatorio';
      allValid = false;
    }
    if (pagoData.expiryMonth && pagoData.expiryYear) {
      const month = parseInt(pagoData.expiryMonth, 10);
      const year = parseInt(pagoData.expiryYear, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (month < 1 || month > 12) {
        errors.expiry = 'El mes debe estar entre 01 y 12';
        allValid = false;
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'La tarjeta ha expirado';
        allValid = false;
      }
    }

    // Validar CVV: 3 o 4 dígitos numéricos
    if (!pagoData.cvv || pagoData.cvv.trim() === '') {
      errors.cvv = 'El CVV es obligatorio';
      allValid = false;
    } else if (!/^\d+$/.test(pagoData.cvv)) {
      errors.cvv = 'El CVV debe contener solo números';
      allValid = false;
    } else if (pagoData.cvv.length < 3 || pagoData.cvv.length > 4) {
      errors.cvv = 'El CVV debe tener 3 o 4 dígitos';
      allValid = false;
    }

    return {
      isValid: allValid,
      errors,
    };
  }, [pagoData]);

  return validation;
};