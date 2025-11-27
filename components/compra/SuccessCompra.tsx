import React from "react";
import { View } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { CircleCheck } from 'lucide-react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { ConfirmPaymentResponse } from "@/services/pagos/pagos.service";
import { useRouter } from "expo-router";
import { usePurchase } from "@/context/PurchaseContext";

interface SuccessCompraProps {
  data: ConfirmPaymentResponse;
}

export default function SuccessCompra({ data }: SuccessCompraProps) {
  const router = useRouter();
  const { purchaseData } = usePurchase();

  const totalAmount = purchaseData
    ? purchaseData.pricePerTicket * purchaseData.quantity
    : 0;

  const handleGoToTickets = () => {
    router.replace("/(pages)/mis-boletos");
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <VStack space="md" className="items-center">
        <CircleCheck color="#009d1c" size={90} />

        <Text className="text-center text-2xl font-semibold text-green-600">{data.message}</Text>

        <Text className="text-sm text-gray-500 font-light text-center mb-1">
          Enviamos tu comprobante por correo electrónico.{'\n'}También puedes consultarlos en la sección de Mis boletos
        </Text>

        <View className="border border-gray-300 p-4 rounded-lg w-50 mt-3">
          
          <Text className="text-lg font-semibold mb-2 text-black">
            Detalles de la Compra
          </Text>

          <Text className="text-black">
            <Text className="font-bold text-black">Código de Pago:</Text> {data.codigoPago}
          </Text>
          
          <Text className="text-black">
            <Text className="font-bold text-black">ID de Transacción:</Text>{" "}
            {data.transaccionId}
          </Text>

          <Text className="text-black">
            <Text className="font-bold text-black">Monto Total:</Text> $
            {totalAmount.toFixed(2)}
          </Text>
          
          <Text className="text-lg font-semibold mt-4 mb-2 text-black">
            Boletos Confirmados:
          </Text>
          {data.boletos.map((boleto, index) => (
            <View key={index} className="mb-2">
              <Text className="text-black">
                <Text className="font-bold text-black">Boleto ID:</Text> {boleto.boletoId}
              </Text>
              <Text className="text-black">
                <Text className="font-bold text-black">Código:</Text> {boleto.codigoBoleto}
              </Text>
            </View>
          ))}
        </View>

        <Button onPress={handleGoToTickets} className="mt-4">
          <ButtonText>Ver Mis Boletos</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}
