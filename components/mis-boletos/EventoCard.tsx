import React from 'react';
import { View, Image } from 'react-native';
import { Card } from '@/components/ui/card';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { EventoUsuario } from '@/services/boletos/boletos.service';
import { styles } from './styles';
import { formatDate } from '../eventos/hooks/useEventos';

interface EventoCardProps {
  evento: EventoUsuario;
  onPressVerBoletos: (evento: EventoUsuario) => void;
  gridConfig: any;
}

export default function EventoCard({ evento, onPressVerBoletos, gridConfig }: EventoCardProps) {
  return (
    <Card className="bg-white shadow-md" style={gridConfig.columns === 1 ? styles.cardMobile : styles.card}>
      {/* Imagen del evento */}
      <Image 
        source={{ uri: evento.imagenEvento }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      
      {/* Contenido de la tarjeta */}
      <VStack className="p-4" space="sm" style={styles.cardContent}>
        <View style={styles.titleContainer}>
          <Heading size="sm" numberOfLines={2}>
            {evento.nombreEvento}
          </Heading>
        </View>
        
        {/* Información del evento */}
        <VStack space="xs" className='mb-2'>
          <Text className="text-xs text-gray-600 mb-1" >
            📅 {formatDate(evento.fechaEvento)} 
          </Text>
          <Text className="text-xs text-gray-600" numberOfLines={1}>
            📍 {evento.ubicacionEvento.split(', ').pop()}
          </Text>
        </VStack>
        
        {/* Botón de acción */}
        <Button 
          size="sm" 
          className="w-full mt-auto"
          onPress={() => onPressVerBoletos(evento)}
        >
          <ButtonText className="text-xs">Ver Boletos</ButtonText>
        </Button>
      </VStack>
    </Card>
  );
}