import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import Markdown from 'react-native-markdown-display';
import { useSession } from "@/context/AuthContext";
import { VStack } from "@/components/ui/vstack";
import { Card } from "@/components/ui/card";
import { Button, ButtonText } from "@/components/ui/button";
import { Input, InputField } from "@/components/ui/input";
import { Send } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { useRouter } from "expo-router";
import { sendMessageToGemini } from "@/services/chatService";
import Animated from 'react-native-reanimated';
import { useAnimatedStyle } from 'react-native-reanimated';
import useGradualAnimation from '@/hooks/useGradualAnimation';

export default function ChatPage() {
  const { isAuthenticated, user } = useSession();
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'model',
      text: '¡Hola! Soy el asistente de soporte de BusTix. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);

  const scrollViewRef = useRef<ScrollView>(null);
  const { height } = useGradualAnimation(0);

  const keyboardPaddingStyle = useAnimatedStyle(() => ({
    height: height.value,
  }), []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessageText = inputText.trim();
    setInputText("");

    // Add user message immediately
    const newUserMessage = {
      role: 'user',
      text: userMessageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare history for API
      // Gemini requires the conversation to start with a user message.
      // We filter out any initial model messages (like the welcome message).
      let history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

      // Remove leading model messages
      while (history.length > 0 && history[0].role === 'model') {
        history.shift();
      }

      // Call the service
      const responseText = await sendMessageToGemini(history as any, userMessageText);

      const newModelMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newModelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <VStack space="md" className="flex-1 pt-4 px-4">
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
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <VStack space="md">
              {messages.map((msg, index) => (
                <View key={index} style={styles.messageContainer}>
                  <HStack space="sm" className={`items-start ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'model' && (
                      <Avatar size="sm">
                        <AvatarFallbackText>SP</AvatarFallbackText>
                      </Avatar>
                    )}

                    <View style={[
                      styles.messageBubble,
                      msg.role === 'user' ? styles.userMessage : styles.modelMessage
                    ]}>
                      <Markdown
                        style={msg.role === 'user' ? markdownStylesUser : markdownStylesModel}
                      >
                        {msg.text}
                      </Markdown>
                      <Text className={`text-xs mt-1 ${msg.role === 'user' ? "text-gray-300" : "text-gray-500"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>

                    {msg.role === 'user' && (
                      <Avatar size="sm">
                        <AvatarFallbackText>{user?.name || 'U'}</AvatarFallbackText>
                      </Avatar>
                    )}
                  </HStack>
                </View>
              ))}

              {isLoading && (
                <View style={styles.messageContainer}>
                  <HStack space="sm" className="items-start">
                    <Avatar size="sm">
                      <AvatarFallbackText>SP</AvatarFallbackText>
                    </Avatar>
                    <View style={[styles.messageBubble, styles.modelMessage]}>
                      <ActivityIndicator size="small" color="#3B82F6" />
                    </View>
                  </HStack>
                </View>
              )}
            </VStack>
          </ScrollView>
        </Card>



        {/* Área de entrada de mensaje */}
        <HStack space="sm" className="px-4 py-2 bg-white rounded-lg">
          <Input className="flex-1">
            <InputField
              placeholder="Escribe tu mensaje aquí..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </Input>
          <Button
            size="md"
            className="bg-blue-600"
            disabled={!inputText.trim() || isLoading}
            onPress={handleSend}
          >
            <Send size={20} color="white" />
          </Button>

          {/* Spacer animado para el teclado */}
          <Animated.View style={keyboardPaddingStyle} />

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
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  modelMessage: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 16,
  },
  infoMessage: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
    borderWidth: 1,
  },
});

const markdownStylesUser = StyleSheet.create({
  body: { color: 'white', fontSize: 16 },
  heading1: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  heading2: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  paragraph: { color: 'white', fontSize: 16, marginBottom: 10 },
  list_item: { color: 'white', fontSize: 16, marginBottom: 5 },
  bullet_list: { color: 'white', marginBottom: 10 },
  ordered_list: { color: 'white', marginBottom: 10 },
  strong: { color: 'white', fontWeight: 'bold' },
  em: { color: 'white', fontStyle: 'italic' },
});

const markdownStylesModel = StyleSheet.create({
  body: { color: '#1F2937', fontSize: 16 },
  heading1: { color: '#1F2937', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  heading2: { color: '#1F2937', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  paragraph: { color: '#1F2937', fontSize: 16, marginBottom: 10 },
  list_item: { color: '#1F2937', fontSize: 16, marginBottom: 5 },
  bullet_list: { color: '#1F2937', marginBottom: 10 },
  ordered_list: { color: '#1F2937', marginBottom: 10 },
  strong: { color: '#1F2937', fontWeight: 'bold' },
  em: { color: '#1F2937', fontStyle: 'italic' },
});