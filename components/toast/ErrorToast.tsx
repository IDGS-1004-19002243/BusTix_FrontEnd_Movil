import React from 'react';
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from '@/components/ui/toast';
import { Pressable } from '@/components/ui/pressable';
import { Icon, CloseIcon, HelpCircleIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { ToastConfig } from './types';

interface ErrorToastProps extends ToastConfig {
  closable?: boolean;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  id,
  title,
  description,
  closable = true
}) => {
  const toast = useToast();
  const toastId = "toast-" + id;

  return (
    <Toast
      action="error"
      variant="outline"
      nativeID={toastId}
      className="p-4 gap-6 border-error-500 w-full shadow-hard-5 max-w-[443px] flex-row justify-between"
    >
      <HStack space="md">
        <Icon as={HelpCircleIcon} className="stroke-error-500 mt-0.5" />
        <VStack space="xs">
          <ToastTitle className="font-semibold text-error-500">
            {title}
          </ToastTitle>
          {description && (
            <ToastDescription size="sm">
              {description}
            </ToastDescription>
          )}
        </VStack>
      </HStack>
      {closable && (
        <Pressable onPress={() => toast.close(id)}>
          <Icon as={CloseIcon} />
        </Pressable>
      )}
    </Toast>
  );
};