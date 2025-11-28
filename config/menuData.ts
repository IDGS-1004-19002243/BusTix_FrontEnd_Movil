import {
  Home,
} from 'lucide-react-native';
import { AlertTriangle } from 'lucide-react-native';
import { MenuSection } from '@/types/sidebar.types';

export const menuSections: MenuSection[] = [
  {
    title: 'Staff',
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
        icon: AlertTriangle,
        label: 'Incidencias',
        active: false,
        color: '#F97316',
        bgColor: '#FFF7ED',
        route: '/(pages)/staff/incidencias'
      },
    ]
  },
];
