import React from "react";
import { useSession } from "@/context/AuthContext";
import AuthenticatedHome from "@/components/home/AuthenticatedHome";
import UnauthenticatedHome from "@/components/home/UnauthenticatedHome";
import StaffHome from "@/components/home/StaffHome";

export default function HomePage() {
  const { isAuthenticated, user } = useSession();

  if (!isAuthenticated) {
    return <UnauthenticatedHome />;
  }

  // ? es optional chaining: permite acceder a propiedades de objetos que podrían 
  // ser null o undefined sin lanzar un error. Si el objeto es null/undefined, 
  // devuelve undefined en lugar de lanzar un error
  
  // - user?: verifica si 'user' no es null/undefined antes de acceder a .roles
  // - roles?: verifica si 'roles' no es null/undefined antes de acceder a [0]
  // Si algo es null/undefined, devuelve undefined sin error

  //  Si user?.roles?.[0] resulta undefined,la condicion del if seria:
  //   undefined === 'User' que es false y si hubiera un else entraría alli
  // Preferir role 'User' para clientes normales
  if (user?.roles?.includes('User')) {
    return <AuthenticatedHome />;
  }

  // Mostrar Home específico para Staff
  if (user?.roles?.includes('Staff')) {
    return <StaffHome />;
  }

  return <UnauthenticatedHome />;
}
