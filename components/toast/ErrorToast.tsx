import React from "react";
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

  return (
    <Toast
      action="error"
      variant="solid"
      nativeID={toastId}
      className="p-4 gap-6 w-full max-w-[386px] bg-error-500 shadow-hard-2"
    >
      <HStack className="flex-row justify-between items-center">
        <HStack space="md" className="items-center">
          <Icon as={HelpCircleIcon} className="stroke-white" />
          <VStack space="xs">
            <ToastTitle className="text-white font-semibold">
              {title}
            </ToastTitle>
            {description && (
              <ToastDescription className="text-white/90">{description}</ToastDescription>
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
