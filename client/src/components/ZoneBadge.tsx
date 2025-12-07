import React from 'react';
import { Zone } from '../types';
import './ZoneBadge.css';

interface ZoneBadgeProps {
  zone: Zone;
}

export function ZoneBadge({ zone }: ZoneBadgeProps) {
  return (
    <span className={`zone-badge zone-${zone.name}`}>
      {zone.label}
    </span>
  );
}
