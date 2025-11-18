import React, { useState } from "react";
import { View, Text } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarBadge,
} from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";
import {
  Menu,
  MenuItem,
  MenuItemLabel,
  MenuSeparator,
} from "@/components/ui/menu";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSession } from "@/context/AuthContext";

// Función para truncar email
const truncateEmail = (email: string, maxLength: number = 20): string => {
  if (email.length <= maxLength) return email;
  return email.substring(0, maxLength) + "...";
};

// Función para truncar username
const truncateUserName = (userName: string, maxLength: number = 15): string => {
  if (userName.length <= maxLength) return userName;
  return userName.substring(0, maxLength) + "...";
};

// Función para obtener el color del badge según el rol
const getRoleBadgeAction = (role: string) => {
  const roleColors = {
    admin: "info",
    manager: "warning",
    user: "success",
  } as const;

  return roleColors[role.toLowerCase() as keyof typeof roleColors] || "error";
};

// Función para obtener el texto del rol formateado
const getRoleText = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
};

const UserProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut, user } = useSession();
  // Preferir `user.name` (desde el token) o derivar del email
  const userName = truncateUserName(
    user?.name ||
      (user?.email ? user.email.split("@")[0] : "Usuario")
  );
  const userEmail = user?.email || 'Sin email';
  const userRole = user?.roles?.[0] || 'user';

  return (
    <>
      <Menu
        offset={3}
        placement="bottom right"
        selectionMode="single"
        className="w-[200px]"
        onOpen={() => setIsMenuOpen(true)}
        onClose={() => setIsMenuOpen(false)}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps}>
              <View
                className={
                  isMenuOpen
                    ? "border border-outline-500  rounded-full p-1"
                    : "p-1"
                }
              >
                <Avatar size={Platform.OS === "web" ? "sm" : "md"}>
                  <AvatarFallbackText>{userName}</AvatarFallbackText>
                  <AvatarBadge className="bg-success-500 border-background-0" />
                </Avatar>
              </View>
            </Pressable>
          );
        }}
      >
        <MenuItem
          key="header"
          textValue="header"
          disabled
          className={Platform.OS === "web" ? "px-2 py-1 cursor-default" : "p-2"}
          style={{
            pointerEvents: "none",
            opacity: 1,
            backgroundColor: "transparent",
          }}
        >
          <View className="flex-row items-center">
            <Avatar size={Platform.OS === "web" ? "sm" : "md"} className="mr-2">
              <AvatarFallbackText>{userName}</AvatarFallbackText>
            </Avatar>
            <View>
              <Text className="text-xs font-medium text-black">{userName}</Text>
              <Text className="text-xs text-typography-500">
                {truncateEmail(userEmail, 18)}
              </Text>
              {userRole.toLowerCase() !== 'user' && (
                <Badge
                  size="sm"
                  variant="solid"
                  action={getRoleBadgeAction(userRole)}
                  style={{ alignSelf: "flex-start", marginTop: 4 }}
                >
                  <BadgeText
                    className="font-bold"
                    style={{ textTransform: "none" }}
                  >
                    {getRoleText(userRole)}
                  </BadgeText>
                </Badge>
              )}
            </View>
          </View>
        </MenuItem>

        <MenuSeparator />

        <MenuItem
          key="Profile"
          textValue="Profile"
          className={Platform.OS === "web" ? "py-1 px-1" : "p-3"}
        >
          <MenuItemLabel size="sm">Perfil</MenuItemLabel>
        </MenuItem>

        <MenuSeparator />

        <MenuItem
          key="Logout"
          textValue="Logout"
          className={Platform.OS === "web" ? "py-1 px-1" : "p-3"}
          onPress={async () => {
            await signOut();
            router.replace("/home");
          }}
        >
          <MenuItemLabel size="sm" className="text-warning-500">
            Cerrar Sesión
          </MenuItemLabel>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;
