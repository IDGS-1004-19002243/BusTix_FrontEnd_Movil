import React from "react";
import { Platform } from "react-native";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";
import { Pressable } from "@/components/ui/pressable";
import { Icon, CloseIcon, CheckCircleIcon } from "@/components/ui/icon";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { ToastConfig } from "./types";

interface SuccessToastProps extends ToastConfig {
  closable?: boolean;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({
  id,
  title,
  description,
  closable = true,
}) => {
  const toast = useToast();
  const isWeb = Platform.OS === 'web';
  
  // Modificación en toastClass: 
  // 1. Se elimina "w-full" en web para que el ancho se ajuste al contenido (dentro del max-w).
  const toastClass = isWeb 
    ? "p-4 gap-6 max-w-[386px] bg-success-500 shadow-hard-2" // Sin w-full, se ajustará al contenido hasta el max-w.
    : "p-4 gap-6 max-w-[300px] bg-success-500 shadow-hard-2";

  return (
    <Toast
      action="success"
      variant="solid"
      nativeID={"toast-" + id}
      className={toastClass}
    >
      <HStack className="flex-row justify-between items-center">
        <HStack space="md" className="items-center">
          <Icon as={CheckCircleIcon} size="md" className="stroke-white" />
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
            {closable && (
            <Pressable onPress={() => toast.close(String(id))} className="justify-center items-center">
              <Icon as={CloseIcon} className="stroke-white" />
            </Pressable>
          )}
        </HStack>
      </HStack>
    </Toast>
  );
};