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
import { MapPin } from 'lucide-react-native';

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

    // Create the custom icon using a local image (Lucide MapPin style)
    // NOTE: You need to create parada_pin.png in assets/ folder with a MapPin-style icon
    const paradaPinIcon = require('@/assets/images/parada_pin.png');

    // Helper to validate and parse coordinates
    const getCoord = (lat: any, lng: any) => {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
            return { lat: latNum, lng: lngNum };
        }
        return null;
    };

    // Calculate total distance in kilometers
    const totalDistance = useMemo(() => {
        if (!viaje) return null;

        // Collect all valid points in order
        const points: { lat: number, lng: number }[] = [];

        const origin = getCoord(viaje.latitudOrigen, viaje.longitudOrigen);
        if (origin) points.push(origin);

        viaje.paradas.forEach(p => {
            const stop = getCoord(p.latitud, p.longitud);
            if (stop) points.push(stop);
        });

        const dest = getCoord(viaje.latitudDestino, viaje.longitudDestino);
        if (dest) points.push(dest);

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

        const allCoords: { latitude: number, longitude: number }[] = [];

        const origin = getCoord(viaje.latitudOrigen, viaje.longitudOrigen);
        if (origin) allCoords.push({ latitude: origin.lat, longitude: origin.lng });

        viaje.paradas.forEach(p => {
            const stop = getCoord(p.latitud, p.longitud);
            if (stop) allCoords.push({ latitude: stop.lat, longitude: stop.lng });
        });

        const dest = getCoord(viaje.latitudDestino, viaje.longitudDestino);
        if (dest) allCoords.push({ latitude: dest.lat, longitude: dest.lng });

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

    // Helper to get valid markers for Apple Maps
    const getAppleMarkers = () => {
        if (!viaje) return [];
        const markers = [];

        const origin = getCoord(viaje.latitudOrigen, viaje.longitudOrigen);
        if (origin) {
            markers.push({
                id: 'origen',
                coordinate: { latitude: origin.lat, longitude: origin.lng },
                title: viaje.ciudadOrigen,
                description: `Salida: ${new Date(viaje.fechaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
            });
        }

        viaje.paradas.forEach(parada => {
            const stop = getCoord(parada.latitud, parada.longitud);
            if (stop) {
                markers.push({
                    id: `parada-${parada.paradaViajeID}`,
                    coordinate: { latitude: stop.lat, longitude: stop.lng },
                    title: parada.nombreParada,
                    description: parada.horaEstimadaLlegada ? `Llegada: ${new Date(parada.horaEstimadaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : `Parada ${parada.ordenParada}`
                });
            }
        });

        const dest = getCoord(viaje.latitudDestino, viaje.longitudDestino);
        if (dest) {
            markers.push({
                id: 'destino',
                coordinate: { latitude: dest.lat, longitude: dest.lng },
                title: viaje.ciudadDestino,
                description: `Llegada: ${new Date(viaje.fechaLlegadaEstimada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
            });
        }

        return markers;
    };

    // Helper to get valid markers for Google Maps
    const getGoogleMarkers = () => {
        if (!viaje) return [];
        const markers = [];

        const origin = getCoord(viaje.latitudOrigen, viaje.longitudOrigen);
        if (origin) {
            markers.push({
                id: 'origen',
                coordinate: { latitude: origin.lat, longitude: origin.lng },
                title: viaje.ciudadOrigen,
                snippet: `Salida: ${new Date(viaje.fechaSalida).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`,
                icon: paradaPinIcon // Custom icon for stops
            });
        }

        viaje.paradas.forEach(parada => {
            const stop = getCoord(parada.latitud, parada.longitud);
            if (stop) {
                markers.push({
                    id: `parada-${parada.paradaViajeID}`,
                    coordinate: { latitude: stop.lat, longitude: stop.lng },
                    title: parada.nombreParada,
                    snippet: parada.horaEstimadaLlegada ? `Llegada: ${new Date(parada.horaEstimadaLlegada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : `Parada ${parada.ordenParada}`,
                    // icon: paradaPinIcon // Custom icon for stops - uncomment when parada_pin.png exists
                });
            }
        });

        const dest = getCoord(viaje.latitudDestino, viaje.longitudDestino);
        if (dest) {
            markers.push({
                id: 'destino',
                coordinate: { latitude: dest.lat, longitude: dest.lng },
                title: viaje.ciudadDestino,
                snippet: `Llegada: ${new Date(viaje.fechaLlegadaEstimada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`
            });
        }

        return markers;
    };


    // Helper for polyline coords
    const getPolylineCoords = () => {
        if (!viaje) return [];
        const coords = [];

        const origin = getCoord(viaje.latitudOrigen, viaje.longitudOrigen);
        if (origin) coords.push({ latitude: origin.lat, longitude: origin.lng });

        viaje.paradas.forEach(p => {
            const stop = getCoord(p.latitud, p.longitud);
            if (stop) coords.push({ latitude: stop.lat, longitude: stop.lng });
        });

        const dest = getCoord(viaje.latitudDestino, viaje.longitudDestino);
        if (dest) coords.push({ latitude: dest.lat, longitude: dest.lng });

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
                        {/* Route Overlay */}
                        <View style={styles.overlayContainer}>
                            <View style={styles.arrivalCard}>
                                <Text style={styles.arrivalLabel}>Ruta del Viaje</Text>
                                <Text style={styles.arrivalTime}>{viaje.ciudadOrigen} → {viaje.ciudadDestino}</Text>
                            </View>
                        </View>

                        <View style={{ flex: 1 }}>
                            {Platform.OS === 'ios' ? (
                                <AppleMaps.View
                                    style={{ flex: 1 }}
                                    cameraPosition={cameraPosition}
                                    markers={getAppleMarkers()}
                                    polylines={[{
                                        id: 'ruta-principal',
                                        coordinates: getPolylineCoords(),
                                        color: '#0f53ff', // Red color
                                        width: 10
                                    }]}
                                />
                            ) : Platform.OS === 'android' ? (
                                <GoogleMaps.View
                                    style={{ flex: 1 }}
                                    cameraPosition={cameraPosition}
                                    properties={{
                                        isMyLocationEnabled: false // Explicitly disable to prevent permission crash
                                    }}
                                    markers={getGoogleMarkers()}
                                    polylines={[{
                                        id: 'ruta-principal',
                                        coordinates: getPolylineCoords(),
                                        color: '#0f53ff', // Red color
                                        width: 15
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
        fontSize: 20,
        color: '#2563eb',
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    arrivalTime: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    arrivalDestination: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
});