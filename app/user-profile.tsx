import { Stack } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import { View, Text, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import Seo from "@/components/helpers/Seo";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  apiGetMiPerfil,
  apiUpdateMiPerfil,
  PerfilUsuario,
} from "@/services/perfil/perfil.service";
import LoadingScreen from "@/components/compra/LoadingScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouteAccess } from "@/hooks/useRouteAccess";
import NotFoundScreen from "./+not-found";
import EditProfileModal from "@/components/user-profile/EditProfileModal";
import { ProfileFormData } from "@/components/user-profile/hooks/useProfileValidation";
import { useToastManager } from "@/components/toast/hooks/useToastManager";

export default function UserProfile() {
  const { user, signOut, isLoading } = useSession();
  const router = useRouter();
  const Web = Platform.OS === "web";
  const insets = useSafeAreaInsets();

  // Route protection
  const { allowed, requiresRole } = useRouteAccess("/user-profile");
  const blocked = !isLoading && requiresRole && !allowed;

  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState<ProfileFormData>({
    nombreCompleto: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
  });

  const { showToast } = useToastManager();

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetMiPerfil();
      if (response.success && response.data) {
        setPerfil(response.data);
        // Initialize edit form with current data
        setEditForm({
          nombreCompleto: response.data?.nombreCompleto || "",
          telefono: response.data?.telefono || "",
          direccion: response.data?.direccion || "",
          ciudad: response.data?.ciudad || "",
          estado: response.data?.estado || "",
          codigoPostal: response.data?.codigoPostal || "",
        });
      } else {
        setError("Error al obtener el perfil");
      }
    } catch (err: any) {
      setError(err.message || "Error al cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  const handleSaveProfile = async () => {
    const dto = {
      nombreCompleto: editForm.nombreCompleto,
      telefono: editForm.telefono,
      direccion: editForm.direccion,
      ciudad: editForm.ciudad,
      estado: editForm.estado,
      codigoPostal: editForm.codigoPostal,
      notificacionesPush: perfil?.notificacionesPush || false,
      notificacionesEmail: perfil?.notificacionesEmail || false,
    };
    const response = await apiUpdateMiPerfil(dto);
    if (!response) {
      throw new Error('Error en la respuesta del servidor');
    }
    if (!response.success) {
      throw new Error(response.message || 'Error al actualizar el perfil');
    }
  };

  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setEditForm({ ...editForm, [field]: value });
  };

  const userName = perfil
    ? perfil.nombreCompleto ||
      (perfil.email ? perfil.email.split("@")[0] : "Usuario")
    : "Usuario";

  return isLoading ? null : blocked ? (
    <NotFoundScreen />
  ) : (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Perfil",
        }}
      />

      <Seo
        title="Perfil de Usuario"
        description="Edita tu perfil de usuario"
      />

      {loading ? (
        <LoadingScreen message="Cargando tu perfil..." />
      ) : error ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
          <VStack space="lg" className="items-center">
            <Heading size="xl" className="text-center text-red-600 mx-8">
              Error
            </Heading>
            <Text className="text-center text-gray-600">{error}</Text>
            <Button onPress={fetchPerfil} size="md" action="positive">
              <ButtonText>Reintentar</ButtonText>
            </Button>
          </VStack>
        </ScrollView>
      ) : !perfil ? (
        <View className="flex-1 justify-center items-center">
          <Text>No se encontró información del perfil.</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
          <VStack style={{marginBottom: insets.bottom}} >
            {/* Profile Header */}
            <View
              style={{
                backgroundColor: "white",
                paddingTop: 30,
                alignItems: "center",
              }}
            >
              <HStack style={{ justifyContent: "center", alignItems: "center", marginBottom: 5 }}>
                <Avatar size="2xl" style={{ marginRight: 8}}>
                  {perfil?.urlFotoPerfil ? <AvatarImage source={{ uri: perfil.urlFotoPerfil }} /> : <AvatarFallbackText>{userName}</AvatarFallbackText>}
                </Avatar>
                <TouchableOpacity onPress={() => setShowEditModal(true)}>
                  <MaterialIcons name="edit" size={24} color="#00A76F" />
                </TouchableOpacity>
              </HStack>

              <HStack style={{ alignItems: "center", marginBottom: 4 }}>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "#000",
                    marginRight: 8,
                  }}
                >
                  {userName}
                </Text>
              </HStack>
            </View>

            {/* Contact Info */}
            <View
              style={{ backgroundColor: "white", marginTop: 2, padding: 20 }}
            >
              <Heading size="sm" style={{ marginBottom: 16, color: "#000" }}>
                Información de Contacto
              </Heading>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="phone"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Telefono:</Text> {perfil.telefono || "No especificado"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center" }}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Correo:</Text> {perfil.email || "No especificado"}
                </Text>
              </HStack>
            </View>

            {/* Personal Information */}
            <View
              style={{ backgroundColor: "white", marginTop: 2, padding: 20 }}
            >
              <Heading size="sm" style={{ marginBottom: 16, color: "#000" }}>
                Información Personal
              </Heading>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="badge"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Tipo Documento:</Text> {perfil.tipoDocumento || "No especificado"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="credit-card"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Número Documento:</Text> {perfil.numeroDocumento || "No especificado"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center" }}>
                <MaterialIcons
                  name="cake"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Fecha Nacimiento:</Text> {perfil.fechaNacimiento ? new Date(perfil.fechaNacimiento).toLocaleDateString() : "No especificada"}
                </Text>
              </HStack>
            </View>

            {/* Address Information */}
            <View
              style={{ backgroundColor: "white", marginTop: 2, padding: 20 }}
            >
              <Heading size="sm" style={{ marginBottom: 16, color: "#000" }}>
                Dirección
              </Heading>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Direccion:</Text> {perfil.direccion || "No especificada"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="location-city"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Ciudad:</Text> {perfil.ciudad || "No especificada"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="map"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Estado:</Text> {perfil.estado || "No especificado"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center" }}>
                <MaterialIcons
                  name="markunread-mailbox"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Código Postal:</Text> {perfil.codigoPostal || "No especificado"}
                </Text>
              </HStack>
            </View>

            {/* Preferences */}
            <View
              style={{ backgroundColor: "white", marginTop: 2, padding: 20 }}
            >
              <Heading size="sm" style={{ marginBottom: 16, color: "#000" }}>
                Preferencias
              </Heading>
              <HStack style={{ alignItems: "center", marginBottom: 16 }}>
                <MaterialIcons
                  name="notifications"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Notificaciones Push:</Text> {perfil.notificacionesPush ? "Sí" : "No"}
                </Text>
              </HStack>
              <HStack style={{ alignItems: "center" }}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#00A76F"
                  style={{ marginRight: 12 }}
                />
                <Text style={{ fontSize: 15, color: "#000" }}>
                  <Text style={{ fontWeight: "bold" }}>Notificaciones Email:</Text> {perfil.notificacionesEmail ? "Sí" : "No"}
                </Text>
              </HStack>
            </View>

            {/* Menu Options */}
            <View style={{ backgroundColor: "white", marginTop: 2 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
                onPress={() => router.push("/mis-boletos")}
              >
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color="#00A76F"
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Mis Boletos
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <MaterialIcons name="payment" size={24} color="#00A76F" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Métodos de Pago
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <MaterialIcons name="people" size={24} color="#00A76F" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Invita a un Amigo
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <MaterialIcons name="local-offer" size={24} color="#00A76F" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Promociones
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f0f0f0",
                }}
              >
                <MaterialIcons name="settings" size={24} color="#00A76F" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#000",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Configuración
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Delete Account */}
            <View style={{ backgroundColor: "white", marginTop: 10 }}>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 20,
                }}
                onPress={() => console.log("Eliminar cuenta")}
              >
                <MaterialIcons name="delete" size={24} color="#ff3b30" />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#ff3b30",
                    marginLeft: 16,
                    flex: 1,
                  }}
                >
                  Eliminar Cuenta
                </Text>
              </TouchableOpacity>
            </View>
          </VStack>
        </ScrollView>
      )}

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        formData={editForm}
        onChange={handleFormChange}
        onSave={handleSaveProfile}
        onSuccess={() => {
          showToast({ type: 'success', title: 'Éxito', description: 'Perfil actualizado exitosamente' });
          setShowEditModal(false);
          fetchPerfil();
        }}
      />
    </>
  );
}
