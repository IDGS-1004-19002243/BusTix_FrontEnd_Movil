import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

interface ConfirmExitModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmExitModal({
  isVisible,
  onConfirm,
  onCancel,
}: ConfirmExitModalProps) {
  return (
    <Modal isOpen={isVisible} onClose={onCancel} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            Confirmar Salida
          </Heading>
        </ModalHeader>
        <ModalBody>
          <VStack space="sm">
            <Text className="text-sm text-typography-500">
              ¿Estás seguro de que deseas salir de la compra?
            </Text>
            <Text className="text-sm text-typography-500">
              Si sales, tendrás que empezar de nuevo el proceso de compra.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={onCancel} className="mr-2">
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={onConfirm}>
            <ButtonText>Aceptar</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}