import React from 'react';
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLogin,
}: AuthModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-semibold">Iniciar Sesión</Text>
          <ModalCloseButton onPress={onClose}>
            <Text>✕</Text>
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text className="text-lg mb-4">
            Para realizar una compra hay que iniciar sesión o registrarse.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onPress={onClose}
            className="mr-2"
          >
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button onPress={onLogin}>
            <ButtonText>Ir a Iniciar Sesión</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}