import { ReactNode } from 'react';

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export interface AuthHeaderProps {
  isMobile: boolean;
}