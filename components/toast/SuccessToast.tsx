import React from "react";
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

  return (
    <Toast
      action="success"
      variant="solid"
      nativeID={"toast-" + id}
      className="p-4 gap-6 w-full max-w-[386px] bg-success-500 shadow-hard-2"
    >
      <HStack className="flex-row justify-between items-center">
        <HStack space="md" className="items-center">
          <Icon as={CheckCircleIcon} className="stroke-white" />
          <VStack space="xs">
            <ToastTitle className="text-white font-semibold">
              {title}
            </ToastTitle>
            {description && (
              <ToastDescription className="text-white/90">
                {description}
              </ToastDescription>
            )}
          </VStack>
        </HStack>
        <HStack className="min-[450px]:gap-3 gap-1 items-center">
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
