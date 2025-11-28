import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Platform, StyleSheet } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { apiGetMisViajesChofer, apiGetViajeDetalleCliente, Viaje, ViajeDetalleCliente, Parada } from '@/services/viajes';
import LoadingScreen from '@/components/compra/LoadingScreen';
import { useSession } from '@/context/AuthContext';
import { useRouteAccess } from '@/hooks/useRouteAccess';
import NotFoundScreen from '../+not-found';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RutaDetailScreen() {
    const { codigoViaje } = useLocalSearchParams<{ codigoViaje: string }>();
    const router = useRouter();
    const { user, isLoading: sessionLoading } = useSession();
    const insets = useSafeAreaInsets();
    const [viaje, setViaje] = useState<ViajeDetalleCliente | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Route protection
    const { allowed, requiresRole } = useRouteAccess("/ruta");
    const blocked = !sessionLoading && requiresRole && !allowed;

    // Calculate total distance in kilometers
    const totalDistance = useMemo(() => {
        if (!viaje) return null;

        // Helper to validate coordinates
        const isValidCoord = (lat: any, lng: any) =>
            typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

        // Collect all valid points in order
        const points: { lat: number, lng: number }[] = [];

        if (isValidCoord(viaje.latitudOrigen, viaje.longitudOrigen)) {
            points.push({ lat: viaje.latitudOrigen, lng: viaje.longitudOrigen });
        }

        viaje.paradas.forEach(p => {
            if (isValidCoord(p.latitud, p.longitud)) {
                points.push({ lat: p.latitud, lng: p.longitud });
            }
        });

        if (isValidCoord(viaje.latitudDestino, viaje.longitudDestino)) {
            points.push({ lat: viaje.latitudDestino, lng: viaje.longitudDestino });
        }

        if (points.length < 2) return null;

        // Haversine formula
        const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
        };

        let total = 0;
        for (let i = 0; i < points.length - 1; i++) {
            total += calculateDistance(
                points[i].lat,
                points[i].lng,
                points[i + 1].lat,
                points[i + 1].lng
            );
        }

        return total.toFixed(1);
    }, [viaje]);

    // Calculate camera position
    const cameraPosition = useMemo(() => {
        if (!viaje) return undefined;

        // Helper to validate coordinates
        const isValidCoord = (lat: any, lng: any) =>
            typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

        const allCoords: { latitude: number, longitude: number }[] = [];

        if (isValidCoord(viaje.latitudOrigen, viaje.longitudOrigen)) {
            allCoords.push({ latitude: viaje.latitudOrigen, longitude: viaje.longitudOrigen });
        }

        viaje.paradas.forEach(p => {
            if (isValidCoord(p.latitud, p.longitud)) {
                allCoords.push({ latitude: p.latitud, longitude: p.longitud });
            }
        });

        if (isValidCoord(viaje.latitudDestino, viaje.longitudDestino)) {
            allCoords.push({ latitude: viaje.latitudDestino, longitude: viaje.longitudDestino });
        }

        if (allCoords.length === 0) return undefined;

        const latitudes = allCoords.map(c => c.latitude);
        const longitudes = allCoords.map(c => c.longitude);

        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        const latSpan = maxLat - minLat;
        const lngSpan = maxLng - minLng;
        const maxSpan = Math.max(latSpan, lngSpan);

        // Avoid division by zero or log of 0/Infinity
        if (maxSpan === 0) {
            return {
                coordinates: {
                    latitude: centerLat,
                    longitude: centerLng
                },
                zoom: 15
            };
        }

        const zoom = Math.max(1, Math.min(15, Math.log2(360 / (maxSpan * 1.5))));

        return {
            coordinates: {
                latitude: centerLat,
                longitude: centerLng
            },
            zoom: zoom
        };
    }, [viaje]);

    const fetchViajeDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const viajesResponse = await apiGetMisViajesChofer();
            const viajeEncontrado = viajesResponse.find((v: Viaje) => v.codigoViaje === codigoViaje && v.choferID === user?.id);

            if (!viajeEncontrado) {
                setError('Viaje no encontrado o no tienes permisos');
                return;
            }

            const detalleResponse = await apiGetViajeDetalleCliente(viajeEncontrado.viajeID);
            setViaje(detalleResponse);
        } catch (err: any) {
            setError(err.message || 'Error al cargar el viaje');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (codigoViaje && user) {
            fetchViajeDetail();
        }
    }, [codigoViaje, user]);

    // Helper to get valid markers
    const getMarkers = () => {
        if (!viaje) return [];
        const markers = [];
        const isValidCoord = (lat: any, lng: any) =>
            typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

        if (isValidCoord(viaje.latitudOrigen, viaje.longitudOrigen)) {
            markers.push({
                id: 'origen',
                coordinate: { latitude: viaje.latitudOrigen, longitude: viaje.longitudOrigen },
                title: viaje.ciudadOrigen,
                description: `Salida: ${new Date(viaje.fechaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`,
                snippet: `Salida: ${new Date(viaje.fechaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
            });
        }

        viaje.paradas.forEach(parada => {
            if (isValidCoord(parada.latitud, parada.longitud)) {
                markers.push({
                    id: `parada-${parada.paradaViajeID}`,
                    coordinate: { latitude: parada.latitud, longitude: parada.longitud },
                    title: parada.nombreParada,
                    description: parada.horaEstimadaLlegada ? `Llegada: ${new Date(parada.horaEstimadaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : '',
                    snippet: parada.horaEstimadaLlegada ? `Llegada: ${new Date(parada.horaEstimadaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : ''
                });
            }
        });

        if (isValidCoord(viaje.latitudDestino, viaje.longitudDestino)) {
            markers.push({
                id: 'destino',
                coordinate: { latitude: viaje.latitudDestino, longitude: viaje.longitudDestino },
                title: viaje.ciudadDestino,
                description: `Llegada: ${new Date(viaje.fechaLlegadaEstimada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`,
                snippet: `Llegada: ${new Date(viaje.fechaLlegadaEstimada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
            });
        }
        return markers;
    };

    // Helper for polyline coords
    const getPolylineCoords = () => {
        if (!viaje) return [];
        const coords = [];
        const isValidCoord = (lat: any, lng: any) =>
            typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng);

        if (isValidCoord(viaje.latitudOrigen, viaje.longitudOrigen)) {
            coords.push({ latitude: viaje.latitudOrigen, longitude: viaje.longitudOrigen });
        }
        viaje.paradas.forEach(p => {
            if (isValidCoord(p.latitud, p.longitud)) {
                coords.push({ latitude: p.latitud, longitude: p.longitud });
            }
        });
        if (isValidCoord(viaje.latitudDestino, viaje.longitudDestino)) {
            coords.push({ latitude: viaje.latitudDestino, longitude: viaje.longitudDestino });
        }
        return coords;
    };

    return sessionLoading ? null : blocked ? (
        <NotFoundScreen />
    ) : (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Detalles del Viaje',
                }}
            />
            {(() => {
                if (!codigoViaje) {
                    return (
                        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
                            <VStack space="lg" className="items-center">
                                <Heading size="xl" className="text-center text-red-600 mx-8">
                                    Error
                                </Heading>
                                <Text className="text-center text-gray-600">Código de viaje no proporcionado.</Text>
                            </VStack>
                        </ScrollView>
                    );
                }

                return loading ? (
                    <LoadingScreen message="Cargando detalles del viaje..." />
                ) : error ? (
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
                        <VStack space="lg" className="items-center">
                            <Heading size="xl" className="text-center text-red-600 mx-8">
                                Error
                            </Heading>
                            <Text className="text-center text-gray-600">{error}</Text>
                            <Button onPress={fetchViajeDetail} size="md" action="positive">
                                <ButtonText>Reintentar</ButtonText>
                            </Button>
                        </VStack>
                    </ScrollView>
                ) : !viaje ? (
                    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
                        <VStack space="lg" className="items-center">
                            <Heading size="xl" className="text-center text-red-600 mx-8">
                                Viaje no encontrado
                            </Heading>
                            <Text className="text-center text-gray-600">El viaje solicitado no existe o no tienes acceso.</Text>
                        </VStack>
                    </ScrollView>
                ) : (
                    <View style={{ flex: 1, backgroundColor: "white", marginBottom: insets.bottom }}>
                        {/* Distance Overlay */}
                        <View style={styles.overlayContainer}>
                            <View style={styles.arrivalCard}>
                                <Text style={styles.arrivalLabel}>Distancia Total</Text>
                                <Text style={styles.arrivalTime}>{totalDistance ? `${totalDistance} km` : 'Calculando...'}</Text>
                                <Text style={styles.arrivalDestination}>{viaje.ciudadOrigen} → {viaje.ciudadDestino}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            {Platform.OS === 'ios' ? (
                                <AppleMaps.View
                                    style={{ flex: 1 }}
                                    cameraPosition={cameraPosition}
                                    markers={getMarkers()}
                                    polylines={[{
                                        id: 'ruta-principal',
                                        coordinates: getPolylineCoords(),
                                        color: '#22c55e', // Green color
                                        width: 5
                                    }]}
                                />
                            ) : Platform.OS === 'android' ? (
                                <GoogleMaps.View
                                    style={{ flex: 1 }}
                                    cameraPosition={cameraPosition}
                                    properties={{
                                        isMyLocationEnabled: false // Explicitly disable to prevent permission crash
                                    }}
                                    markers={getMarkers()}
                                    polylines={[{
                                        id: 'ruta-principal',
                                        coordinates: getPolylineCoords(),
                                        color: '#22c55e', // Green color
                                        width: 5
                                    }]}
                                />
                            ) : (
                                <Text>Maps are only available on Android and iOS</Text>
                            )}
                        </View>
                    </View>
                );
            })()}
        </>
    );
}

const styles = StyleSheet.create({
    overlayContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 1000,
        alignItems: 'center',
    },
    arrivalCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        minWidth: 280,
        alignItems: 'center',
    },
    arrivalLabel: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    arrivalTime: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 6,
    },
    arrivalDestination: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
});