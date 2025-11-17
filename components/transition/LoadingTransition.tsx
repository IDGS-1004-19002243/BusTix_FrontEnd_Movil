import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Center } from '@/components/ui/center';



interface LoadingTransitionProps {
  duration?: number; // in ms
  onComplete?: () => void;
}

const LoadingTransition: React.FC<LoadingTransitionProps> = ({ duration = 2000, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete?.();
          return 100;
        }
        return prev + 2; // increment by 2% each time
      });
    }, duration / 50); // 50 steps

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <Center className="flex-1 bg-background-0">
      <View className="items-center">
        <Image source={require('@/assets/images/Logo_sidebar.png')} style={{ width: 100, height: 100 }} />
        <View className="w-[200px] mt-4">
          <Progress value={progress} size="sm" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </View>
      </View>
    </Center>
  );
};

export default LoadingTransition;