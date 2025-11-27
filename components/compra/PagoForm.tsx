import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
} from "@/components/ui/form-control";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { AlertCircleIcon, ChevronDownIcon } from "@/components/ui/icon";
import { CircleCheck } from "lucide-react-native";
import { usePagoValidation } from "./hooks/usePagoValidation";

interface PagoFormProps {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  name: string;
  onCardNumberChange: (value: string) => void;
  onExpiryMonthChange: (value: string) => void;
  onExpiryYearChange: (value: string) => void;
  onCvvChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  forceShowErrors?: boolean;
}

export default function PagoForm({
  cardNumber,
  expiryMonth,
  expiryYear,
  cvv,
  name,
  onCardNumberChange,
  onExpiryMonthChange,
  onExpiryYearChange,
  onCvvChange,
  onNameChange,
  onValidationChange,
  forceShowErrors = false,
}: PagoFormProps) {
  // Generar años desde el actual hasta 12 años después
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 12 }, (_, i) =>
    (currentYear + i).toString().slice(-2)
  );

  const pagoData = { cardNumber, expiryMonth, expiryYear, cvv, name };
  const { isValid, errors } = usePagoValidation(pagoData);
  const [touched, setTouched] = useState([false, false, false, false, false]);

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleFieldChange = (
    fieldIndex: number,
    value: string,
    onChange: (value: string) => void
  ) => {
    let formattedValue = value;

    // Formatear número de tarjeta con espacios cada 4 dígitos
    if (fieldIndex === 0) {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .slice(0, 19);
    }

    onChange(formattedValue);
    const newTouched = [...touched];
    newTouched[fieldIndex] = true;
    setTouched(newTouched);
  };

  const handleSelectChange = (
    fieldIndex: number,
    value: string,
    onChange: (value: string) => void
  ) => {
    let processedValue = value;
    if (fieldIndex === 2) {
      // Convert YY to full year for expiryYear
      processedValue = (2000 + parseInt(value, 10)).toString();
    }
    onChange(processedValue);
    const newTouched = [...touched];
    newTouched[fieldIndex] = true;
    setTouched(newTouched);
  };

  const isComplete = cardNumber && expiryMonth && expiryYear && cvv && name;
  const hasErrors =
    errors.cardNumber ||
    errors.expiryMonth ||
    errors.expiryYear ||
    errors.expiry ||
    errors.cvv ||
    errors.name;

  return (
    <VStack className="p-6">
      <HStack style={{ alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Heading size="md">Información de Pago</Heading>
        {isComplete && !hasErrors && <CircleCheck color="#22c55e" size={20} />}
      </HStack>

      <Text className="text-sm text-gray-600 mb-4">
        Por favor, proporciona la información de pago
      </Text>

      <VStack space="md">
        {/* Primera línea: Número de tarjeta y Nombre */}
        <HStack space="md">
          <FormControl
            isInvalid={(touched[0] || forceShowErrors) && !!errors.cardNumber}
            size="sm"
            isRequired
            className="flex-1"
          >
            <Input className="my-1">
              <InputField
                placeholder="Numero de la tarjeta"
                value={cardNumber}
                onChangeText={(value) =>
                  handleFieldChange(0, value, onCardNumberChange)
                }
                keyboardType="numeric"
                maxLength={19}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                {errors.cardNumber}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            isInvalid={(touched[4] || forceShowErrors) && !!errors.name}
            size="sm"
            isRequired
            className="flex-1"
          >
            <Input className="my-1">
              <InputField
                placeholder="Nombre del titular de la tarjeta"
                value={name}
                onChangeText={(value) =>
                  handleFieldChange(4, value, onNameChange)
                }
                autoCapitalize="words"
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-500"
              />
              <FormControlErrorText className="text-red-500">
                {errors.name}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </HStack>

        {/* Segunda línea: MM/YY selects y CVV */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, flex: 1 }}>
            <FormControl
              isInvalid={
                (touched[1] || forceShowErrors) && !!errors.expiryMonth
              }
              size="sm"
              isRequired
              className="flex-1"
            >
              <Select
                selectedValue={expiryMonth}
                onValueChange={(value) =>
                  handleSelectChange(1, value, onExpiryMonthChange)
                }
                className="flex-1"
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput
                    placeholder="MM"
                    value={expiryMonth || undefined}
                  />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Enero (01)" value="01" />
                    <SelectItem label="Febrero (02)" value="02" />
                    <SelectItem label="Marzo (03)" value="03" />
                    <SelectItem label="Abril (04)" value="04" />
                    <SelectItem label="Mayo (05)" value="05" />
                    <SelectItem label="Junio (06)" value="06" />
                    <SelectItem label="Julio (07)" value="07" />
                    <SelectItem label="Agosto (08)" value="08" />
                    <SelectItem label="Septiembre (09)" value="09" />
                    <SelectItem label="Octubre (10)" value="10" />
                    <SelectItem label="Noviembre (11)" value="11" />
                    <SelectItem label="Diciembre (12)" value="12" />
                  </SelectContent>
                </SelectPortal>
              </Select>
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {errors.expiryMonth}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <Text className="text-lg" style={{ paddingTop: 10 }}>/</Text>

            <FormControl
              isInvalid={
                (touched[2] || forceShowErrors) &&
                (!!errors.expiryYear || !!errors.expiry)
              }
              size="sm"
              isRequired
              className="flex-1"
            >
              <Select
                selectedValue={
                  expiryYear
                    ? (parseInt(expiryYear, 10) - 2000).toString()
                    : undefined
                }
                onValueChange={(value) =>
                  handleSelectChange(2, value, onExpiryYearChange)
                }
                className="flex-1"
              >
                <SelectTrigger variant="outline" size="md">
                  <SelectInput
                    placeholder="YY"
                    value={
                      expiryYear
                        ? (parseInt(expiryYear, 10) - 2000).toString()
                        : undefined
                    }
                  />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {years.map((year) => (
                      <SelectItem
                        key={year}
                        label={(2000 + parseInt(year, 10)).toString()}
                        value={year}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {errors.expiryYear || errors.expiry}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </View>
          <View style={{ flex: 1 , }}>
            <FormControl
              isInvalid={(touched[3] || forceShowErrors) && !!errors.cvv}
              size="sm"
              isRequired
              className="flex-1"
            >
              <Input>
                <InputField
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={(value) =>
                    handleFieldChange(3, value, onCvvChange)
                  }
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </Input>
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {errors.cvv}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </View>
        </View>
      </VStack>
    </VStack>
  );
}
