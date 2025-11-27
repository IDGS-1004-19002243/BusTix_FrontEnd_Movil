import React, { useEffect, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
// Reanimated (librería para animaciones suaves): usamos Animated.View (vista animada)
// y useAnimatedStyle (usar estilo animado) para crear animaciones fluidas.
// Lo usamos para mover un espacio al final cuando aparece el teclado
// y así evitar que los campos queden tapados.
import Animated from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';
// useGradualAnimation (hook): función que mide el teclado y devuelve su altura.
// - Devuelve una shared value (valor compartido) llamada `height`.
// - height (altura) = altura en píxeles del teclado + un pequeño margen.
import useGradualAnimation from '@/hooks/useGradualAnimation';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
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
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { CircleCheck } from 'lucide-react-native';
import { usePasajerosValidation } from './hooks/usePasajerosValidation';
import { PasajeroData } from '@/context/PurchaseContext';

// Re-exportar para compatibilidad con imports existentes
export type { PasajeroData };

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
  
  // height (altura): valor compartido que devuelve useGradualAnimation.
  // Es la altura del teclado en px (incluye un pequeño margen).
  // Se usa para empujar el contenido y que los inputs no queden tapados.
  const { height } = useGradualAnimation();

  // keyboardPaddingStyle (estilo de relleno para el teclado): convierte la altura
  // en un estilo animado. Lo usamos en un <Animated.View (vista animada)> para
  // crear un espacio (spacer / espaciador) que empuja el contenido hacia arriba
  // cuando se abre el teclado.
  const keyboardPaddingStyle = useAnimatedStyle(() => ({
    height: height.value,
  }), []);

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
      
      <ScrollView
        style={{ flex: 1 }}
        // `showsVerticalScrollIndicator`: muestra/oculta la barra de scroll vertical.
        showsVerticalScrollIndicator={true}
        // `keyboardShouldPersistTaps`: controla si los taps (toques) se procesan
        // cuando el teclado está abierto. Con "handled" los taps en botones
        // o inputs internos se manejan incluso si el teclado está activo.
        // Si el usuario pulsa "Enviar" en el teclado, la acción se ejecuta
        // inmediatamente; no hace falta cerrar el teclado y luego tocar el botón.
        keyboardShouldPersistTaps="handled"
      >
        <Accordion
          size="md"
          variant="unfilled"
          type="multiple"
          className="w-full"
        >
          {Array.from({ length: quantity }, (_, index) => (
            <React.Fragment key={`pasajero-${index}`}>
              <AccordionItem value={`pasajero-${index}`}>
                <AccordionHeader>
                  <AccordionTrigger>
                    {({ isExpanded }: { isExpanded: boolean }) => {
                      const pasajero = pasajeros[index];
                      const isComplete = pasajero?.nombre && pasajero?.email && pasajero?.telefono;
                      const hasErrors = errors[index] && (errors[index].nombre || errors[index].email || errors[index].telefono);
                      
                      return (
                        <>
                          <HStack style={{ alignItems: 'center', justifyContent: 'space-between', flex: 1, marginRight: Platform.OS !== 'web' ? 20 : 0 }}>
                            <HStack style={{ alignItems: 'center', gap: 8 }}>
                              <AccordionTitleText>
                                Pasajero {index + 1}
                              </AccordionTitleText>
                              {isComplete && !hasErrors && <CircleCheck color="#22c55e" size={16} />}
                            </HStack>
                            {isExpanded ? (
                              <AccordionIcon as={ChevronUp} size="md" />
                            ) : (
                              <AccordionIcon as={ChevronDown} size="md" />
                            )}
                          </HStack>
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
            </React.Fragment>
          ))}
        </Accordion>
        {/* Espaciador animado:
          - Es un contenedor vacío (espaciador) que cambia su altura según el teclado.
          - Cuando el teclado aparece, sube y empuja los campos.
          - Añade padding (relleno) al final del contenido: el espaciador
            ocupa espacio y, como el layout usa `flex`, el contenedor se
            adapta automáticamente al nuevo tamaño.
        */}
        <Animated.View style={keyboardPaddingStyle} />
      </ScrollView>
    </VStack>
  );
}
