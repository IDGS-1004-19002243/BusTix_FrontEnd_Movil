import {
  Home,
  User,
  Settings,
  Calendar,
} from 'lucide-react-native';
import { Camera } from 'lucide-react-native';
import { List } from 'lucide-react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Play } from 'lucide-react-native';
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
  {
    title: 'Staff',
    items: [
      {
        icon: Camera,
        label: 'Escáner QR',
        active: false,
        color: '#0EA5A4',
        bgColor: '#CCFBF1',
        route: '/(pages)/staff/scan'
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
