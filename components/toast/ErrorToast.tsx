import React from "react";
import { Platform } from "react-native";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";
import { Pressable } from "@/components/ui/pressable";
import { Icon, CloseIcon, HelpCircleIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ToastConfig } from "./types";

interface ErrorToastProps extends ToastConfig {
  closable?: boolean;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  id,
  title,
  description,
  closable = true,
}) => {
  const toast = useToast();
  const toastId = "toast-" + id;
  const isWeb = Platform.OS === 'web';
  
  // Modificación en toastClass: 
  // - En web, se mantiene el ancho máximo, pero el ancho por defecto será auto.
  // - En nativo, el ancho por defecto de los toasts ya suele ser adaptativo con un máximo, 
  //   pero se asegura que no haya un ancho fijo.
  const toastClass = isWeb 
    ? "p-4 gap-6 max-w-[386px] bg-error-500 shadow-hard-2" // Sin w-full, se ajustará al contenido hasta el max-w.
    : "p-4 gap-6 max-w-[300px] bg-error-500 shadow-hard-2";

  return (
    <Toast
      action="error"
      variant="solid"
      nativeID={toastId}
      className={toastClass}
      // ELIMINADO: style={{ minHeight: 100 }} para que la altura se ajuste al contenido.
    >
      <HStack className="flex-row justify-between items-center">
        <HStack space="md" className="items-center">
          <Icon as={HelpCircleIcon} size="md" className="stroke-white" />
          <VStack space="xs" className="flex-1">
            <ToastTitle className="text-white font-semibold">
              {title}
            </ToastTitle>
            {description && (
              <ToastDescription className="text-white/90" style={{ flexWrap: 'wrap' }} numberOfLines={0}>
                {description}
              </ToastDescription>
            )}
          </VStack>
        </HStack>
        <HStack className="min-[450px]:gap-3 gap-1 items-center">
          <HStack>
            {closable && (
              <Pressable onPress={() => toast.close(String(id))} className="justify-center items-center">
                <Icon as={CloseIcon} className="stroke-white" />
              </Pressable>
            )}
          </HStack>
        </HStack>
      </HStack>
    </Toast>
  );
};