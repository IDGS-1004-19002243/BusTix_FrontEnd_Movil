import React, { useEffect, useState, FC } from "react";
import { View, Image } from "react-native";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Motion, MotionComponentProps } from "@legendapp/motion";

type IMotionViewProps = React.ComponentProps<typeof View> & MotionComponentProps<typeof View, any, any, any, any>;
const MotionView = Motion.View as React.ComponentType<IMotionViewProps>;

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
  const [isExiting, setIsExiting] = useState(false);

  // Paso 1: useEffect para animar el progreso de la barra de carga.
  // - Se inicia un intervalo que incrementa el estado 'progress' cada (duration / 50) ms.
  // - Cada incremento es de 2% (hasta llegar a 100%), simulando una carga gradual.
  // - Cuando progress alcanza 100, se limpia el intervalo para detener la animación.
  // - Esto evita llamar 'onComplete' directamente aquí para prevenir actualizaciones de estado durante el render.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // increment by 2% each time
      });
    }, duration / 50); // 50 steps

    return () => clearInterval(interval);
  }, [duration]);

  // Paso 2: useEffect que observa cuando 'progress' llega a 100.
  // - Una vez que la barra de progreso está completa, se activa 'isExiting' para iniciar la animación de salida.
  // - Esto separa la lógica de progreso de la animación de fade-out.
  useEffect(() => {
    if (progress >= 100) {
      setIsExiting(true);
    }
  }, [progress]);

  // Paso 3: Render del componente MotionView.
  // - MotionView es un componente de la librería @legendapp/motion que permite animaciones fluidas en React Native.
  // - Se comporta como un View normal pero con capacidades de animación basadas en propiedades como initial, animate y transition.
  return (
    <MotionView
      // className: Aplica estilos de Tailwind CSS al componente. Aquí, hace que ocupe toda la pantalla (flex-1 w-full h-full),
      // tenga fondo blanco (bg-white), y centre el contenido horizontal y verticalmente (items-center justify-center).
      className="flex-1 w-full h-full bg-white items-center justify-center"
      // initial: Define el estado inicial de la animación. Aquí, la opacidad comienza en 0 (completamente invisible) para crear un fade-in al aparecer.
      initial={{ opacity: 0 }}
      // animate: Define el estado objetivo de la animación. Si isExiting es true, anima la opacidad de 1 a 0 en 500ms (fade-out, desapareciendo gradualmente);
      // de lo contrario, anima a opacidad de 0 a 1 (fade-in, apareciendo gradualmente).
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      // transition: Configura la duración de la animación. Aquí, la transición de opacidad toma 500 milisegundos.
      transition={{ duration: 500 }}
      // onAnimationComplete: Callback que se ejecuta cuando la animación termina. Si isExiting es true, llama a onComplete para notificar el fin de la transición.
      onAnimationComplete={() => {
        if (isExiting) {
          onComplete?.();
        }
      }}
    >
      <View className="items-center">
        <Image
          source={require("@/assets/images/Logo_sidebar.png")}
          style={{ width: 100, height: 100 }}
        />
        <View className="w-[200px] mt-4">
          <Progress value={progress} size="sm" orientation="horizontal">
            <ProgressFilledTrack className="bg-black" />
          </Progress>
        </View>
      </View>
    </MotionView>
  );
};

export default LoadingTransition;
