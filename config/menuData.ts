import {
  Home,
  User,
  Settings,
  Calendar,
} from 'lucide-react-native';
import { MenuSection } from '@/types/sidebar.types';

export const menuSections: MenuSection[] = [
  {
    title: 'Inicio',
    items: [
      { 
        icon: Home, 
        label: 'Inicio', 
        active: false, 
        color: '#10B981', 
        bgColor: '#D1FAE5',
        route: '/(pages)/home'
      },
      { 
        icon: Calendar, 
        label: 'Eventos', 
        active: false, 
        color: '#F59E0B', 
        bgColor: '#FEF3C7',
        route: '/(pages)/eventos'
      },
      {
        icon: Settings,
        label: 'Configuración',
        active: false,
        color: '#6B7280',
        bgColor: '#E5E7EB',
        route: '/(pages)/settings'
      },
    ]
  },
];
