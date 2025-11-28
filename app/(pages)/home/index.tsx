import React from "react";
import { useSession } from "@/context/AuthContext";
import AuthenticatedHome from "@/components/home/AuthenticatedHome";
import UnauthenticatedHome from "@/components/home/UnauthenticatedHome";

export default function HomePage() {
  const { isAuthenticated, user } = useSession();

  if (!isAuthenticated) {
    return <UnauthenticatedHome />;
  }

  // Lista de roles que pueden acceder a la home autenticada
  const allowedRoles = ['User', 'Admin', 'Manager', 'Staff', 'Operator'];
  const role = user?.roles?.[0];

  if (role && allowedRoles.includes(role)) {
    return <AuthenticatedHome />;
  }

  return <UnauthenticatedHome />;
}
