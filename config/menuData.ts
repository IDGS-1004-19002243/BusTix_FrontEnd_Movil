import {
  Home,
  User,
  Settings,
  Calendar,
  FileText,
  BarChart3,
  Briefcase,
  List,
  AlertCircle,
  Package,
  Send,
  Shield,
  PenTool,
  Circle
} from 'lucide-react-native';
import { MenuSection } from '@/types/sidebar.types';

export const menuSections: MenuSection[] = [
  {
    title: 'Dashboard',
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
    ]
  },
  {
    title: 'Páginas',
    items: [
      { 
        icon: Briefcase, 
        label: 'Gestión', 
        hasSubmenu: true, 
        color: '#6B7280', 
        active: false,
        key: 'management',
        submenu: [
          { label: 'Gestión de Usuarios', route: '/(pages)/users' },
          { label: 'Gestión de Roles', route: '/(pages)/roles' },
          { label: 'Configuración', route: '/(pages)/settings' }
        ]
      },
      { 
        icon: List, 
        label: 'Niveles', 
        hasSubmenu: true, 
        color: '#6B7280', 
        active: false,
        key: 'menu-level',
        submenu: [
          { label: 'Nivel 1-1', route: '/(pages)/level-1-1' },
          { label: 'Nivel 1-2', route: '/(pages)/level-1-2' },
          { label: 'Nivel 1-3', route: '/(pages)/level-1-3' }
        ]
      },
      { 
        icon: AlertCircle, 
        label: 'Páginas de Error', 
        hasSubmenu: true, 
        color: '#6B7280', 
        active: false,
        key: 'error-page',
        submenu: [
          { label: '403 - Prohibido', route: '/(pages)/403' },
          { label: '404 - No Encontrado', route: '/(pages)/404' },
          { label: '500 - Error Servidor', route: '/(pages)/500' }
        ]
      },
    ]
  },
  {
    title: 'UI',
    items: [
      { 
        icon: Package, 
        label: 'Components', 
        subtitle: 'Custom UI Components',
        hasSubmenu: true, 
        color: '#6B7280',
        active: false,
        key: 'components',
        submenu: [
          { label: 'Buttons' },
          { label: 'Forms' },
          { label: 'Tables' },
          { label: 'Cards' }
        ]
      },
      { 
        icon: Send, 
        label: 'Functions', 
        hasSubmenu: true, 
        color: '#6B7280', 
        active: false,
        key: 'functions',
        submenu: [
          { label: 'Copy' },
          { label: 'Clipboard' }
        ]
      },
    ]
  },
  {
    title: 'Otros',
    items: [
      { icon: Shield, label: 'Permisos', color: '#6B7280', active: false, route: '/(pages)/permissions' },
      { icon: Calendar, label: 'Calendario', color: '#6B7280', active: false, route: '/(pages)/calendar' },
      { icon: FileText, label: 'Kanban', color: '#6B7280', active: false, route: '/(pages)/kanban' },
      { icon: Settings, label: 'Configuración', color: '#6B7280', active: false, route: '/(pages)/settings' },
    ]
  }
];
