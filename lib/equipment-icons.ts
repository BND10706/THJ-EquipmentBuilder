// Map of equipment slots to their corresponding icon files
export const EQUIPMENT_ICONS = {
  // Head area
  Head: '/icons/equipment/head.svg',
  Face: '/icons/equipment/face.svg',
  Ear1: '/icons/equipment/ear.svg',
  Ear2: '/icons/equipment/ear.svg',
  
  // Torso area
  Chest: '/icons/equipment/chest.svg',
  Back: '/icons/equipment/back.svg',
  Shoulders: '/icons/equipment/shoulders.svg',
  Arms: '/icons/equipment/arms.svg',
  Hands: '/icons/equipment/hands.svg',
  
  // Accessories
  Neck: '/icons/equipment/neck.svg',
  Wrist1: '/icons/equipment/wrist.svg',
  Wrist2: '/icons/equipment/wrist.svg',
  Belt: '/icons/equipment/belt.svg',
  Ring1: '/icons/equipment/ring.svg',
  Ring2: '/icons/equipment/ring.svg',
  
  // Lower body
  Legs: '/icons/equipment/legs.svg',
  Feet: '/icons/equipment/feet.svg',
  
  // Special items
  Charm: '/icons/equipment/charm.svg',
  Power: '/icons/equipment/power.svg',
  
  // Weapons and ammo
  Primary: '/icons/equipment/weapon.svg',
  Secondary: '/icons/equipment/shield.svg',
  Range: '/icons/equipment/bow.svg',
  Ammo: '/icons/equipment/ammo.svg',
} as const;

// Type for equipment slots
export type EquipmentSlot = keyof typeof EQUIPMENT_ICONS; 