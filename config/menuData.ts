import {
  Home,
  User,
  Settings,
  Calendar,
  Ticket,
  MessageCircle,
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
        icon: Ticket, 
        label: 'Mis Boletos', 
        active: false, 
        color: '#3B82F6', 
        bgColor: '#DBEAFE',
        route: '/(pages)/mis-boletos'
      },
      { 
        icon: MessageCircle, 
        label: 'Chat', 
        active: false, 
        color: '#8B5CF6', 
        bgColor: '#EDE9FE',
        route: '/(pages)/chat'
      },
    ]
  },
];
