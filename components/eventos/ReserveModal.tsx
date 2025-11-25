import React from 'react';
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
  onConfirm: () => void;
}

export default function ReserveModal({
  isOpen,
  onClose,
  event,
  quantity,
  onQuantityChange,
  onConfirm,
}: ReserveModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-bold  text-black">Reservar Viaje</Text>
          <ModalCloseButton onPress={onClose}>
            <Text>✕</Text>
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text className="text-lg mb-4">
            ¿Confirmas la reserva de viaje para {event.nombre}?
          </Text>
          <VStack space="md" className="mb-4">
            <HStack className="items-center justify-center space-x-4">
                <Button
                  size="sm"
                  disabled={quantity <= 1}
                  variant="outline"
                  // Si quantity = 1, entonces: Math.max(1, 0) = 1 (mínimo 1 boleto)
                  // Math.max regresa el mayor de los dos valores
                  onPress={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="mr-2"
                >
                  <ButtonText>-</ButtonText>
                </Button>
              
              <Text className="text-lg font-semibold ">
                {quantity} boleto(s)
              </Text>
              <Button
                size="sm"
                variant="outline"
                onPress={() => onQuantityChange(quantity + 1)}
                className="ml-2"
              >
                <ButtonText>+</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onPress={onClose}
            className="mr-2"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={onConfirm}>
            <ButtonText>Confirmar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}