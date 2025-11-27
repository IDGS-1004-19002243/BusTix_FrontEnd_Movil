import { Stack } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";
import { View, Text, ScrollView } from "react-native";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";
import { Icon, CloseIcon } from "@/components/ui/icon";
import Seo from "@/components/helpers/Seo";
import { useSession } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  apiGetMiPerfil,
  PerfilUsuario,
} from "@/services/perfil/perfil.service";
import LoadingScreen from "@/components/compra/LoadingScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouteAccess } from "@/hooks/useRouteAccess";
import NotFoundScreen from "./+not-found";

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
  const [editForm, setEditForm] = useState({
    nombreCompleto: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    estado: "",
    codigoPostal: "",
  });

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiGetMiPerfil();
      if (response.success) {
        setPerfil(response.data);
        // Initialize edit form with current data
        setEditForm({
          nombreCompleto: response.data.nombreCompleto || "",
          telefono: response.data.telefono || "",
          direccion: response.data.direccion || "",
          ciudad: response.data.ciudad || "",
          estado: response.data.estado || "",
          codigoPostal: response.data.codigoPostal || "",
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
    // TODO: Implement API call to update profile
    console.log("Saving profile:", editForm);
    setShowEditModal(false);
    // After successful save, refresh profile
    // await fetchPerfil();
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
        description="Ve y edita tu perfil en BusTix."
      />

      {loading ? (
        <LoadingScreen message="Cargando tu perfil..." />
      ) : error ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <Text className="text-center">Inténtalo de nuevo más tarde.</Text>
        </View>
      ) : !perfil ? (
        <View className="flex-1 justify-center items-center">
          <Text>No se encontró información del perfil.</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
          <VStack >
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
                  <AvatarFallbackText>{userName}</AvatarFallbackText>
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
                  {perfil.telefono || "No especificado"}
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
                  {perfil.email}
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

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">Editar Perfil</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <ScrollView>
              <VStack space="md">
                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Nombre Completo
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.nombreCompleto}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, nombreCompleto: text })
                      }
                      placeholder="Ingresa tu nombre completo"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Teléfono
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.telefono}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, telefono: text })
                      }
                      placeholder="Ingresa tu teléfono"
                      keyboardType="phone-pad"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Dirección
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.direccion}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, direccion: text })
                      }
                      placeholder="Ingresa tu dirección"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Ciudad
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.ciudad}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, ciudad: text })
                      }
                      placeholder="Ingresa tu ciudad"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Estado
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.estado}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, estado: text })
                      }
                      placeholder="Ingresa tu estado"
                    />
                  </Input>
                </VStack>

                <VStack space="xs">
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    Código Postal
                  </Text>
                  <Input>
                    <InputField
                      value={editForm.codigoPostal}
                      onChangeText={(text) =>
                        setEditForm({ ...editForm, codigoPostal: text })
                      }
                      placeholder="Ingresa tu código postal"
                      keyboardType="numeric"
                    />
                  </Input>
                </VStack>
              </VStack>
            </ScrollView>
          </ModalBody>
          <ModalFooter>
            <HStack space="md" style={{ width: "100%" }}>
              <Button
                variant="outline"
                onPress={() => setShowEditModal(false)}
                style={{ flex: 1 }}
              >
                <ButtonText>Cancelar</ButtonText>
              </Button>
              <Button
                onPress={handleSaveProfile}
                style={{ flex: 1, backgroundColor: "#000" }}
              >
                <ButtonText>Guardar</ButtonText>
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
