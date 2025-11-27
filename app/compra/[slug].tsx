import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity, Platform, BackHandler } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '@/context/AuthContext';
import { usePurchase } from '@/context/PurchaseContext';

// Componentes de compra
import { LoadingScreen, AuthRequiredScreen, ExpiredSessionScreen, Stepper, ConfirmExitModal } from '@/components/compra';
import { PasajeroData } from '@/components/compra/PasajerosForm';

// Helpers
import Seo from '@/components/helpers/Seo';

export const options = {
  title: 'Compra de Boletos',
  headerShown: true,
};

export default function CompraScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // ===== HOOKS Y CONTEXTO =====
  // Obtener parámetros de la URL: /compra/[slug]?token=[sessionToken]
  const { slug, token } = useLocalSearchParams<{ slug: string; token: string }>();
  
  const { isAuthenticated } = useSession(); // Contexto de autenticación
  const { purchaseData, validatePurchaseData, clearPurchaseData, setPurchaseData } = usePurchase(); // Contexto de compra
  
  // ===== ESTADO =====
  // Estado para mostrar loading mientras se validan los datos
  const [loading, setLoading] = useState(true);
  
  // Estado para precio calculado
  // const [calculatedPrice, setCalculatedPrice] = useState(purchaseData?.pricePerTicket || 0);
  
  // Estados para información de pago
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  
  // Estado para pasajeros
  const [pasajeros, setPasajeros] = useState<PasajeroData[]>([]);

  // Estado para modal de confirmación de salida
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);

  // Estado para sesión expirada durante el proceso
  const [sessionExpired, setSessionExpired] = useState(false);

  // ===== FUNCIONES =====
  
  // Función que valida todo y retorna qué mostrar
  const validarAccesoCompra = () => {
    // PASO 1: Verificar si el usuario está logueado
    if (!isAuthenticated) {
      return <AuthRequiredScreen />;
    }

    // PASO 2: Verificar si tenemos datos de compra
    if (!purchaseData) {
      return <ExpiredSessionScreen />;
    }

    // PASO 3: Verificar si la sesión ha expirado
    if (sessionExpired) {
      return <ExpiredSessionScreen />;
    }

    // PASO 4: Verificar si la URL tiene slug y token
    if (!slug || !token) {
      return <ExpiredSessionScreen />;
    }

    // PASO 5: Verificar si el slug de la URL coincide con el evento
    if (purchaseData.eventSlug !== slug) {
      return <ExpiredSessionScreen />;
    }

    // PASO 6: Verificar si el token de la URL coincide con el de sesión
    if (purchaseData.sessionToken !== token) {
      return <ExpiredSessionScreen />;
    }

    // SI TODAS LAS VALIDACIONES PASAN, retornar null (mostrar flujo de compra)
    return null;
  };

  const handleFinish = () => {
    // Validar que todos los pasajeros tengan información completa

  };

  const handleExitConfirm = () => {
    clearPurchaseData();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/eventos');
    }
  };

  const handleExitCancel = () => {
    setIsExitModalVisible(false);
  };

  // ===== EFECTOS =====
  
  // Validar datos cuando estén disponibles y quitar loading
  useEffect(() => {
    //Cuando purchaseData se establece (ya sea con datos válidos o null),
    // el useEffect ejecuta setLoading(false), quitando el loading.
    setLoading(false);
  }, [purchaseData]); // se pone como dependencia para que cuando cambien los datos se vuelva a evaluar
                      // y pueda quitar el loading en el momento correcto

  // Verificar si la sesión ya expiró despues de montar el componente
  useEffect(() => {
    if (purchaseData && !validatePurchaseData()) {
      setSessionExpired(true);
    }
  }, []); // Solo al montar

  // Inicializar array de pasajeros cuando cambie la cantidad
  useEffect(() => {
    if (purchaseData?.quantity) {
      const initialPasajeros = Array.from({ length: purchaseData.quantity }, () => ({
        nombre: '',
        email: '',
        telefono: '',
      }));
      setPasajeros(initialPasajeros);
    }
  }, [purchaseData?.quantity]);

  // Validar sesión periódicamente durante el proceso de compra
  useEffect(() => {
    // Solo iniciar el intervalo si ya pasó la validación inicial y no está expirada
    if (purchaseData && !sessionExpired) { // Si hay datos en el contexto y la sesión no ha expirado
      const interval = setInterval(() => { // se crea el intervalo que se ejecuta cada minuto
        if (!validatePurchaseData()) { // Regresa true si los datos son válidos, false si expiraron
          // La funcion toma el tiempo actual y lo compara con el timestamp guardado en el contexto
          setSessionExpired(true); //Si no es valido, se marca la sesión como expirada, y se muestra la pantalla correspondiente
        }
      }, 60000); // Cada 1 minuto

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar o si cambian las dependencias
    }
  }, [sessionExpired]); // Se ejecuta cada vez que cambie sessionExpired

  // Limpiar datos cuando la sesión expire
  useEffect(() => {
    if (sessionExpired) {
      clearPurchaseData();
    }
  }, [sessionExpired]); // Se ejecuta cada vez que cambie sessionExpired


  // Manejar botón de atrás físico
  useEffect(() => {
    const backAction = () => {
      setIsExitModalVisible(true);
      return true; // Prevenir comportamiento por defecto
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  // ===== RENDER =====
  
  // Mostrar loading mientras se hacen las validaciones
  if (loading) {
    return <LoadingScreen />;
  }

  // Ejecutar función de validación
  const pantallaValidacion = validarAccesoCompra();
  
  // Si la validación retorna un componente, mostrarlo
  if (pantallaValidacion) { // Si es null, no entra aquí y no muestra nada
    return pantallaValidacion;
  }

  // Si la sesión expira durante el proceso, mostrar pantalla de expiración
  if (sessionExpired) {
    return <ExpiredSessionScreen />;
  }

  // SI TODAS LAS VALIDACIONES PASAN, mostrar el flujo de compra
  const { quantity, pricePerTicket, eventName, eventImage, viajeId, paradaAbordajeId } = purchaseData!;
  const total = quantity * pricePerTicket;

  return (
    <>
      <Seo title={`Comprar Boletos - ${eventName}`} />
      <Stack.Screen 
        options={{ 
          headerShown: true, 
          title: 'Compra de Boletos',
          headerLeft: () => (
            <TouchableOpacity onPress={() => setIsExitModalVisible(true)} className={Platform.OS === 'web' ? "p-2" : ""} activeOpacity={0.7}>
              <Image 
                source={require('@/assets/icons/back.png')}
                style={{ width: 24, height: 24, marginLeft: 11, marginRight: Platform.OS === 'web' ? 3 : 18 }}
              />
            </TouchableOpacity>
          )
        }} 
      />
      <Stepper
        eventName={eventName}
        eventImage={eventImage}
        quantity={quantity}
        pricePerTicket={pricePerTicket}
        total={total}
        viajeId={viajeId}
        paradaAbordajeId={paradaAbordajeId}
        cardNumber={cardNumber}
        expiryMonth={expiryMonth}
        expiryYear={expiryYear}
        cvv={cvv}
        name={name}
        onCardNumberChange={setCardNumber}
        onExpiryMonthChange={setExpiryMonth}
        onExpiryYearChange={setExpiryYear}
        onCvvChange={setCvv}
        onNameChange={setName}
        pasajeros={pasajeros}
        onPasajerosChange={setPasajeros}
        onFinish={handleFinish}
        bottomInset={insets.bottom}
      />
      <ConfirmExitModal
        isVisible={isExitModalVisible}
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />
    </>
  );
}