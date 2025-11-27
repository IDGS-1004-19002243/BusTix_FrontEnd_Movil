import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { Event } from '@/services/eventos/eventos.types';

interface ReserveModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onConfirm: (selectedParada: any) => void;
  paradasWithCities?: any[];
}

export default function ReserveModal({
  isOpen,
  onClose,
  event,
  quantity,
  onQuantityChange,
  onConfirm,
  paradasWithCities = [],
}: ReserveModalProps) {
  const [selectedParadaIndex, setSelectedParadaIndex] = useState<number | null>(paradasWithCities.length > 0 ? 0 : null);

  const { width } = Dimensions.get('window');
  const isMobile = width <= 768;

  const selectedParada = selectedParadaIndex !== null ? paradasWithCities[selectedParadaIndex] : null;
  const unitPrice = selectedParada ? selectedParada.totalAPagar : 0;
  const totalPrice = unitPrice * quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-bold text-black">Reserva tu viaje</Text>
          <ModalCloseButton onPress={onClose}>
            <Text>✕</Text>
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>


          {/* Selección de parada */}
          <Text className="text-md font-semibold mb-2">Selecciona tu punto de abordaje:</Text>
          {isMobile ? (
            <VStack space="sm" className="mb-4">
              {paradasWithCities.map((parada, index) => (
                <Button
                  key={parada.paradaViajeID}
                  variant={selectedParadaIndex === index ? "solid" : "outline"}
                  onPress={() => setSelectedParadaIndex(index)}
                  className="w-full justify-center"
                >
                  <ButtonText>
                     {parada.city}
                  </ButtonText>
                </Button>
              ))}
            </VStack>
          ) : (
            <HStack space="sm" className="flex-wrap mb-4">
              {paradasWithCities.map((parada, index) => (
                <Button
                  key={parada.paradaViajeID}
                  variant={selectedParadaIndex === index ? "solid" : "outline"}
                  onPress={() => setSelectedParadaIndex(index)}
                  className="flex-1 justify-center"
                >
                  <ButtonText>
                     {parada.city}
                  </ButtonText>
                </Button>
              ))}
            </HStack>
          )}

          {/* Precio del punto seleccionado */}
          {selectedParada && (
            <Text className="text-md text-black-600 mb-3">
              <Text className="font-bold">Costo individual:</Text> ${unitPrice} (IVA incluido)
            </Text>
          )}

          {/* Selección de cantidad - solo aparece si se seleccionó una parada */}
          {selectedParada && (
            <VStack space="md" className="mb-4">
              <Text className="text-md text-black font-semibold">Cantidad de boletos:</Text>
              <HStack className="w-full items-center justify-center">
                <Button
                  size="sm"
                  disabled={quantity <= 1}
                  variant={quantity > 1 ? "solid" : "outline"}
                  onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
                >
                  <ButtonText>-</ButtonText>
                </Button>
                <Text className="text-lg font-semibold mx-4">
                  {quantity} {quantity === 1 ? 'boleto' : 'boletos'}
                </Text>
                <Button
                  size="sm"
                  disabled={quantity >= 5}
                  variant={quantity >= 5 ? "outline" : "solid"}
                  onPress={() => onQuantityChange(Math.min(5, quantity + 1))}
                >
                  <ButtonText>+</ButtonText>
                </Button>
              </HStack>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onPress={onClose}
            className="mr-2"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={() => onConfirm(selectedParada)} disabled={selectedParadaIndex === null}>
            <ButtonText>Confirmar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
