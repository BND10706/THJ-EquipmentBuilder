import { getAssetPath } from './utils';

// Map of equipment slots to their corresponding icon files
export const EQUIPMENT_ICONS = {
  // Head area
  Head: getAssetPath('/public/icons/equipment/head.svg'),
  Face: getAssetPath('/public/icons/equipment/face.svg'),
  Ear1: getAssetPath('/public/icons/equipment/ear.svg'),
  Ear2: getAssetPath('/public/icons/equipment/ear.svg'),
  
  // Torso area
  Chest: getAssetPath('/public/icons/equipment/chest.svg'),
  Back: getAssetPath('/public/icons/equipment/back.svg'),
  Shoulders: getAssetPath('/public/icons/equipment/shoulders.svg'),
  Arms: getAssetPath('/public/icons/equipment/arms.svg'),
  Hands: getAssetPath('/public/icons/equipment/hands.svg'),
  
  // Accessories
  Neck: getAssetPath('/public/icons/equipment/neck.svg'),
  Wrist1: getAssetPath('/public/icons/equipment/wrist.svg'),
  Wrist2: getAssetPath('/public/icons/equipment/wrist.svg'),
  Belt: getAssetPath('/public/icons/equipment/belt.svg'),
  Ring1: getAssetPath('/public/icons/equipment/ring.svg'),
  Ring2: getAssetPath('/public/icons/equipment/ring.svg'),
  
  // Lower body
  Legs: getAssetPath('/public/icons/equipment/legs.svg'),
  Feet: getAssetPath('/public/icons/equipment/feet.svg'),
  
  // Special items
  Charm: getAssetPath('/public/icons/equipment/charm.svg'),
  Power: getAssetPath('/public/icons/equipment/power.svg'),
  
  // Weapons and ammo
  Primary: getAssetPath('/public/icons/equipment/weapon.svg'),
  Secondary: getAssetPath('/public/icons/equipment/shield.svg'),
  Range: getAssetPath('/public/icons/equipment/bow.svg'),
  Ammo: getAssetPath('/public/icons/equipment/ammo.svg'),
} as const;

// Type for equipment slots
export type EquipmentSlot = keyof typeof EQUIPMENT_ICONS; 