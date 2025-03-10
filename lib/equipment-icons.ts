import { getAssetPath } from './utils';

// Map of equipment slots to their corresponding icon files
export const EQUIPMENT_ICONS = {
  // Head area
  Head: getAssetPath('icons/equipment/head.svg'),
  Face: getAssetPath('icons/equipment/face.svg'),
  EarLeft: getAssetPath('icons/equipment/ear.svg'),
  EarRight: getAssetPath('icons/equipment/ear.svg'),
  
  // Torso area
  Chest: getAssetPath('icons/equipment/chest.svg'),
  Back: getAssetPath('icons/equipment/back.svg'),
  Shoulder: getAssetPath('icons/equipment/shoulders.svg'),
  Arms: getAssetPath('icons/equipment/arms.svg'),
  Hands: getAssetPath('icons/equipment/hands.svg'),
  
  // Accessories
  Neck: getAssetPath('icons/equipment/neck.svg'),
  BracerLeft: getAssetPath('icons/equipment/wrist.svg'),
  BracerRight: getAssetPath('icons/equipment/wrist.svg'),
  Waist: getAssetPath('icons/equipment/belt.svg'),
  RingLeft: getAssetPath('icons/equipment/ring.svg'),
  RingRight: getAssetPath('icons/equipment/ring.svg'),
  
  // Lower body
  Legs: getAssetPath('icons/equipment/legs.svg'),
  Feet: getAssetPath('icons/equipment/feet.svg'),
  
  // Special items
  Charm: getAssetPath('icons/equipment/charm.svg'),
  Powersource: getAssetPath('icons/equipment/power.svg'),
  
  // Weapons and ammo
  Primary: getAssetPath('icons/equipment/weapon.svg'),
  Secondary: getAssetPath('icons/equipment/shield.svg'),
  Range: getAssetPath('icons/equipment/bow.svg'),
  Ammo: getAssetPath('icons/equipment/ammo.svg'),
} as const;

// Type for equipment slots
export type EquipmentSlot = keyof typeof EQUIPMENT_ICONS; 