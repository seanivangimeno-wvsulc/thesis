import React from 'react';
import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = '', size = 24 }: LucideIconProps) {
  // Safe lookup for icon name, falling back to a general icon if missing.
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} size={size} />;}
