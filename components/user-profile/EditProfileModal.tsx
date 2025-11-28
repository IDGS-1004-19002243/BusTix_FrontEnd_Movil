import React, { useState } from "react";
import { Pressable, ScrollView, TouchableOpacity } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText, ButtonSpinner } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import {
  Icon,
  CloseIcon,
  InfoIcon,
  AlertCircleIcon,
} from "@/components/ui/icon";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from "@/components/ui/form-control";
import { Alert, AlertText, AlertIcon } from "@/components/ui/alert";
import {
  ProfileFormData,
  useProfileValidation,
} from "./hooks/useProfileValidation";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string) => void;
  onSave: () => Promise<void>;
  onSuccess: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSave,
  onSuccess,
}: EditProfileModalProps) {
  if (!formData) return null;

  const { isValid, errors } = useProfileValidation(formData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [forceShowErrors, setForceShowErrors] = useState(false);
  const [alertType, setAlertType] = useState<"error" | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clearAlert = () => {
    setAlertType(null);
    setAlertMessage(null);
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    onChange(field, value);
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    if (isValid) {
      setForceShowErrors(false);
      setLoading(true);
      try {
        await onSave();
        onSuccess();
      } catch (error: any) {
        let message = "Error desconocido";
        if (error && typeof error === "object" && error.message) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        }
        setAlertType("error");
        setAlertMessage(message);
      } finally {
        setLoading(false);
      }
    } else {
      setForceShowErrors(true);
    }
  };

  const shouldShowError = (field: string) =>
    (touched[field] || forceShowErrors) && !!errors[field];
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">Editar Perfil</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <ScrollView
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={true}
          >
            <VStack className="p-1 pt-3" space="md">
              {alertType === "error" && alertMessage && (
                <Alert
                  action="error"
                  className="gap-4 max-w-[585px] w-full self-center items-start min-[400px]:items-center"
                >
                  <VStack className="gap-4 min-[400px]:flex-row justify-between flex-1 min-[400px]:items-center">
                    <HStack className="gap-3 items-center">
                      <AlertIcon as={InfoIcon} />
                      <AlertText size="sm" className="font-semibold text-typography-900">{alertMessage}</AlertText>
                    </HStack>
                  </VStack>
                  <Pressable onPress={clearAlert}>
                    <Icon as={CloseIcon} />
                  </Pressable>
                </Alert>
              )}
              <FormControl
                isInvalid={shouldShowError("nombreCompleto")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Nombre Completo</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.nombreCompleto}
                    onChangeText={(text) =>
                      handleChange("nombreCompleto", text)
                    }
                    placeholder="Ingresa tu nombre completo"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.nombreCompleto}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={shouldShowError("telefono")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Teléfono</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.telefono}
                    onChangeText={(text) => handleChange("telefono", text)}
                    placeholder="Ingresa tu teléfono"
                    keyboardType="phone-pad"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.telefono}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={shouldShowError("direccion")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Dirección</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.direccion}
                    onChangeText={(text) => handleChange("direccion", text)}
                    placeholder="Ingresa tu dirección"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.direccion}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={shouldShowError("ciudad")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Ciudad</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.ciudad}
                    onChangeText={(text) => handleChange("ciudad", text)}
                    placeholder="Ingresa tu ciudad"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.ciudad}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={shouldShowError("estado")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Estado</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.estado}
                    onChangeText={(text) => handleChange("estado", text)}
                    placeholder="Ingresa tu estado"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.estado}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={shouldShowError("codigoPostal")}
                size="sm"
                isRequired
              >
                <FormControlLabel>
                  <Text className="text-sm font-semibold">Código Postal</Text>
                </FormControlLabel>
                <Input className="my-1">
                  <InputField
                    value={formData.codigoPostal}
                    onChangeText={(text) => handleChange("codigoPostal", text)}
                    placeholder="Ingresa tu código postal"
                    keyboardType="numeric"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-500"
                  />
                  <FormControlErrorText className="text-red-500">
                    {errors.codigoPostal}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </ScrollView>
        </ModalBody>
        <ModalFooter>
          <HStack space="md" style={{ width: "100%" }}>
            <Button
              size="sm"
              variant="outline"
              onPress={onClose}
              style={{ flex: 1 }}
            >
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button
              size="sm"
              variant="solid"
              style={{ flex: 1, backgroundColor: "#000" }}
              onPress={handleSave}
              isDisabled={loading}
            >
              {loading ? (
                <>
                  <ButtonSpinner color="white" />
                </>
              ) : (
                <ButtonText className="text-white">Guardar</ButtonText>
              )}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
