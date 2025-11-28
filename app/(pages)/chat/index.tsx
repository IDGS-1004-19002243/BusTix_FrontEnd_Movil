import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSession } from "@/context/AuthContext";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { useRouter } from "expo-router";

export default function ChatPage() {
  const { isAuthenticated, user } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");

  // Pantalla de chat para todos los usuarios
  return (
    <View style={styles.container}>
      <VStack space="md" className="flex-1 p-4 ">
        {/* Header */}
        <HStack space="sm" className="items-center p-4 bg-white rounded-lg">
          <Avatar size="md">
            <AvatarFallbackText>SP</AvatarFallbackText>
          </Avatar>
          <VStack className="flex-1">
            <Text className="font-semibold text-lg">Soporte BusTix</Text>
            <Text className="text-gray-600 text-sm">En línea</Text>
          </VStack>
          {!isAuthenticated && (
            <Button size="sm" variant="outline" onPress={() => router.push("/sign-in")}>
              <ButtonText>Iniciar Sesión</ButtonText>
            </Button>
          )}
        </HStack>

        {/* Área de mensajes */}
        <Card className="flex-1 p-4">
          <ScrollView style={styles.messagesContainer}>
            <VStack space="md">
              {/* Mensaje de bienvenida del sistema */}
              <View style={styles.messageContainer}>
                <HStack space="sm" className="items-start">
                  <Avatar size="sm">
                    <AvatarFallbackText>SP</AvatarFallbackText>
                  </Avatar>
                  <View style={styles.messageBubble}>
                    <Text className="text-gray-800">
                      ¡Hola! Soy el asistente de soporte de BusTix. ¿En qué puedo ayudarte hoy?
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                      {new Date().toLocaleTimeString()}
                    </Text>
                  </View>
                </HStack>
              </View>

              {!isAuthenticated && (
                <View style={styles.messageContainer}>
                  <HStack space="sm" className="items-start">
                    <Avatar size="sm">
                      <AvatarFallbackText>SP</AvatarFallbackText>
                    </Avatar>
                    <View style={[styles.messageBubble, styles.infoMessage]}>
                      <Text className="text-blue-800">
                        💡 Para soporte personalizado con tu cuenta, inicia sesión. Sin embargo, puedes hacer consultas generales aquí.
                      </Text>
                      <Text className="text-xs text-blue-600 mt-1">
                        {new Date().toLocaleTimeString()}
                      </Text>
                    </View>
                  </HStack>
                </View>
              )}

              {isAuthenticated && (
                <>
                  {/* Mensaje de ejemplo del usuario autenticado */}
                  <View style={styles.messageContainer}>
                    <HStack space="sm" className="items-start justify-end">
                      <View style={[styles.messageBubble, styles.userMessage]}>
                        <Text className="text-white">
                          Hola, tengo una duda sobre mi boleto de viaje.
                        </Text>
                        <Text className="text-xs text-gray-300 mt-1">
                          {new Date().toLocaleTimeString()}
                        </Text>
                      </View>
                      <Avatar size="sm">
                        <AvatarFallbackText>{user?.name?.charAt(0) || 'U'}</AvatarFallbackText>
                      </Avatar>
                    </HStack>
                  </View>

                  {/* Mensaje de respuesta del soporte */}
                  <View style={styles.messageContainer}>
                    <HStack space="sm" className="items-start">
                      <Avatar size="sm">
                        <AvatarFallbackText>SP</AvatarFallbackText>
                      </Avatar>
                      <View style={styles.messageBubble}>
                        <Text className="text-gray-800">
                          Claro, estaré encantado de ayudarte. ¿Puedes proporcionarme el número de tu boleto o más detalles sobre tu consulta?
                        </Text>
                        <Text className="text-xs text-gray-500 mt-1">
                          {new Date().toLocaleTimeString()}
                        </Text>
                      </View>
                    </HStack>
                  </View>
                </>
              )}
            </VStack>
          </ScrollView>
        </Card>

        {/* Área de entrada de mensaje */}
        <HStack space="sm" className="p-4 bg-white rounded-lg">
          <Input className="flex-1">
            <InputField
              placeholder={isAuthenticated ? "Escribe tu mensaje aquí..." : "Escribe tu consulta general aquí..."}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
          </Input>
          <Button
            size="md"
            className="bg-blue-600"
            disabled={!message.trim()}
          >
            <Send size={20} color="white" />
          </Button>
        </HStack>

 
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageBubble: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  infoMessage: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
});