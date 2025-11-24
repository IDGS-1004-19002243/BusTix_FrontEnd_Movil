import React, { useEffect, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionTitleText,
  AccordionContent,
  AccordionIcon,
} from '@/components/ui/accordion';
import { Divider } from '@/components/ui/divider';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icon';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { usePasajerosValidation } from './hooks/usePasajerosValidation';

export interface PasajeroData {
  nombre: string;
  email: string;
  telefono: string;
}

interface PasajerosFormProps {
  quantity: number;
  pasajeros: PasajeroData[];
  onPasajerosChange: (pasajeros: PasajeroData[]) => void;
  onValidationChange?: (isValid: boolean) => void;
  forceShowErrors?: boolean;
}

export default function PasajerosForm({ 
  quantity, 
  pasajeros, 
  onPasajerosChange,
  onValidationChange,
  forceShowErrors = false
}: PasajerosFormProps) {
  
  const { isValid, errors } = usePasajerosValidation(pasajeros);
  const [touched, setTouched] = useState<boolean[][]>(() => 
    Array.from({ length: quantity }, () => [false, false, false])
  );

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);
  
  const handlePasajeroChange = (index: number, field: keyof PasajeroData, value: string) => {
    const newPasajeros = [...pasajeros];
    newPasajeros[index] = {
      ...newPasajeros[index],
      [field]: value,
    };
    onPasajerosChange(newPasajeros);

    // Marcar como tocado
    const fieldIndex = field === 'nombre' ? 0 : field === 'email' ? 1 : 2;
    const newTouched = [...touched];
    newTouched[index][fieldIndex] = true;
    setTouched(newTouched);
  };

  return (
    <VStack className="p-6">
      <Heading size="md" className="mb-4">Información de Pasajeros</Heading>
      <Text className="text-sm text-gray-600 mb-4">
        Por favor, proporciona la información de cada pasajero
      </Text>
      
      <Accordion
        size="md"
        variant="unfilled"
        type="multiple"
        className="w-full border border-gray-200 rounded-md"
      >
        {Array.from({ length: quantity }, (_, index) => (
          <>
            <AccordionItem value={`pasajero-${index}`}>
              <AccordionHeader>
                <AccordionTrigger>
                  {({ isExpanded }: { isExpanded: boolean }) => {
                    const pasajero = pasajeros[index];
                    const isComplete = pasajero?.nombre && pasajero?.email && pasajero?.telefono;
                    
                    return (
                      <>
                        <AccordionTitleText>
                          Pasajero {index + 1}
                          {isComplete && ' ✓'}
                        </AccordionTitleText>
                        {isExpanded ? (
                          <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                        ) : (
                          <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                        )}
                      </>
                    );
                  }}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>
                <VStack space="md" className="p-4">
                  <FormControl isInvalid={(touched[index]?.[0] || forceShowErrors) && !!errors[index]?.nombre} size="sm" isRequired>
                    <FormControlLabel>
                      <Text className="text-sm font-semibold">Nombre Completo</Text>
                    </FormControlLabel>
                    <Input className="my-1">
                      <InputField
                        placeholder="Ej: Juan Pérez"
                        value={pasajeros[index]?.nombre || ''}
                        onChangeText={(value) => handlePasajeroChange(index, 'nombre', value)}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                      <FormControlErrorText className="text-red-500">
                        {errors[index]?.nombre}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  
                  <FormControl isInvalid={(touched[index]?.[1] || forceShowErrors) && !!errors[index]?.email} size="sm" isRequired>
                    <FormControlLabel>
                      <Text className="text-sm font-semibold">Email</Text>
                    </FormControlLabel>
                    <Input className="my-1">
                      <InputField
                        placeholder="ejemplo@correo.com"
                        value={pasajeros[index]?.email || ''}
                        onChangeText={(value) => handlePasajeroChange(index, 'email', value)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                      <FormControlErrorText className="text-red-500">
                        {errors[index]?.email}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  
                  <FormControl isInvalid={(touched[index]?.[2] || forceShowErrors) && !!errors[index]?.telefono} size="sm" isRequired>
                    <FormControlLabel>
                      <Text className="text-sm font-semibold">Teléfono</Text>
                    </FormControlLabel>
                    <Input className="my-1">
                      <InputField
                        placeholder="Ej: 1234567890"
                        value={pasajeros[index]?.telefono || ''}
                        onChangeText={(value) => handlePasajeroChange(index, 'telefono', value)}
                        keyboardType="phone-pad"
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
                      <FormControlErrorText className="text-red-500">
                        {errors[index]?.telefono}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                </VStack>
              </AccordionContent>
            </AccordionItem>
            {index < quantity - 1 && <Divider />}
          </>
        ))}
      </Accordion>
    </VStack>
  );
}
