import React, { useEffect, useState, FC } from "react";
import { View, Image } from "react-native";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Center } from "@/components/ui/center";

interface LoadingTransitionProps {
  duration?: number; // in ms
  onComplete?: () => void;
}

// FC<LoadingTransitionProps> es un tipo genérico de React que indica que este es un Function Component
// que recibe props del tipo LoadingTransitionProps. FC significa FunctionComponent y asegura type-safety.
const LoadingTransition: FC<LoadingTransitionProps> = ({
  duration = 2000,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // El array de dependencias [duration, onComplete] hace que el efecto se re-ejecute solo cuando estos valores cambian.
    // Si onComplete cambia, se reinicia el efecto para usar la nueva función callback.
    // La función de cleanup (return) se ejecuta antes de re-ejecutar el efecto o al desmontar el componente,
    // limpiando el intervalo para evitar memory leaks.
    // El setInterval actualiza el estado 'progress' cada duration/50 ms, lo que provoca re-renders del componente
    // para animar la barra de progreso. El componente se re-renderiza ~50 veces hasta que progress llegue a 100,
    // momento en el que el intervalo se limpia y los re-renders se detienen.
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
    <View className="flex-1 w-full h-full bg-background-0 items-center justify-center">
      <View className="items-center">
        <Image
          source={require("@/assets/images/Logo_sidebar.png")}
          style={{ width: 100, height: 100 }}
        />
        <View className="w-[200px] mt-4">
          <Progress value={progress} size="sm" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
        </View>
      </View>
    </View>
  );
};

export default LoadingTransition;
