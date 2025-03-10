export const SLOT_BITMASKS = {
  CHARM: 1,          // 2^0
  EAR1: 2,          // 2^1
  HEAD: 4,          // 2^2
  FACE: 8,          // 2^3
  EAR2: 16,         // 2^4
  NECK: 32,         // 2^5
  SHOULDER: 64,     // 2^6
  ARMS: 128,        // 2^7
  BACK: 256,        // 2^8
  BRACER1: 512,     // 2^9
  BRACER2: 1024,    // 2^10
  RANGE: 2048,      // 2^11
  HANDS: 4096,      // 2^12
  PRIMARY: 8192,    // 2^13
  SECONDARY: 16384, // 2^14
  RING1: 32768,     // 2^15
  RING2: 65536,     // 2^16
  CHEST: 131072,    // 2^17
  LEGS: 262144,     // 2^18
  FEET: 524288,     // 2^19
  WAIST: 1048576,   // 2^20
  POWERSOURCE: 2097152, // 2^21
  AMMO: 4194304     // 2^22
} as const;

// Type for valid slot bitmask values
export type SlotBitmask = typeof SLOT_BITMASKS[keyof typeof SLOT_BITMASKS];

// Define paired slots
export const PAIRED_SLOTS: Record<string, readonly SlotBitmask[]> = {
  EAR: [SLOT_BITMASKS.EAR1, SLOT_BITMASKS.EAR2],
  BRACER: [SLOT_BITMASKS.BRACER1, SLOT_BITMASKS.BRACER2],
  RING: [SLOT_BITMASKS.RING1, SLOT_BITMASKS.RING2],
  WEAPON: [SLOT_BITMASKS.PRIMARY, SLOT_BITMASKS.SECONDARY]
} as const;

// Helper functions for slot operations
export const SlotUtils = {
  // Check if an item can be equipped in a specific slot
  canEquipInSlot: (itemSlotBitmask: number, targetSlotBitmask: SlotBitmask): boolean => {
    return (itemSlotBitmask & targetSlotBitmask) !== 0;
  },

  // Get all valid slots for an item
  getValidSlots: (itemSlotBitmask: number): SlotBitmask[] => {
    return Object.values(SLOT_BITMASKS).filter(slotMask => 
      (itemSlotBitmask & slotMask) !== 0
    );
  },

  // Check if an item can be equipped in either slot of a pair
  canEquipInPairedSlot: (itemSlotBitmask: number, pairedSlots: readonly SlotBitmask[]): boolean => {
    return pairedSlots.some(slot => (itemSlotBitmask & slot) !== 0);
  },

  // Get the first available slot from a pair
  getFirstAvailablePairedSlot: (
    itemSlotBitmask: number, 
    pairedSlots: readonly SlotBitmask[], 
    equippedItems: Record<string, Item>
  ): SlotBitmask | null => {
    // Check if item can go in either slot
    if (!SlotUtils.canEquipInPairedSlot(itemSlotBitmask, pairedSlots)) {
      return null;
    }

    // Try first slot
    const firstSlot = pairedSlots[0];
    const firstSlotKey = Object.keys(SLOT_BITMASKS).find(key => SLOT_BITMASKS[key as keyof typeof SLOT_BITMASKS] === firstSlot);
    if ((itemSlotBitmask & firstSlot) !== 0 && firstSlotKey && !equippedItems[firstSlotKey]) {
      return firstSlot;
    }

    // Try second slot
    const secondSlot = pairedSlots[1];
    const secondSlotKey = Object.keys(SLOT_BITMASKS).find(key => SLOT_BITMASKS[key as keyof typeof SLOT_BITMASKS] === secondSlot);
    if ((itemSlotBitmask & secondSlot) !== 0 && secondSlotKey && !equippedItems[secondSlotKey]) {
      return secondSlot;
    }

    return null;
  },

  // Get display name for a slot
  getSlotName: (slotBitmask: SlotBitmask): string => {
    const entry = Object.entries(SLOT_BITMASKS)
      .find(([_, mask]) => mask === slotBitmask);
    return entry ? entry[0].replace(/([A-Z])/g, ' $1').trim() : 'Unknown Slot';
  },

  // Check if a slot is part of a pair
  isPairedSlot: (slotBitmask: SlotBitmask): boolean => {
    return Object.values(PAIRED_SLOTS)
      .some(pair => pair.includes(slotBitmask));
  },

  // Get the paired slot for a given slot
  getPairedSlot: (slotBitmask: SlotBitmask): SlotBitmask | null => {
    const pair = Object.values(PAIRED_SLOTS)
      .find(pair => pair.includes(slotBitmask));
    if (!pair) return null;
    return pair[0] === slotBitmask ? pair[1] : pair[0];
  }
};

export interface Item {
  id: number;
  name: string;
  type: number;
  slot: number; // This will be a bitmask using SLOT_BITMASKS
  defense: number;
  stats: {
    strength?: number;
    agility?: number;
    stamina?: number;
    intelligence?: number;
    wisdom?: number;
    dexterity?: number;
    accuracy?: number;
    attack?: number;
    charisma?: number;
    poison_resist?: number;
    magic_resist?: number;
    disease_resist?: number;
    fire_resist?: number;
    cold_resist?: number;
    hp?: number;      // Affects base HP stat
    mana?: number;    // Affects base MP stat
    spelldmg?: number; // Affects base DMG stat
  };
  heroic_stats?: {
    strength?: number;
    agility?: number;
    stamina?: number;
    intelligence?: number;
    wisdom?: number;
    dexterity?: number;
    charisma?: number;
    poison_resist?: number;
    disease_resist?: number;
    fire_resist?: number;
    cold_resist?: number;
    magic_resist?: number;
    corruption_resist?: number;
    healamt?: number;
    hp?: number;      // Affects base HP stat
    mana?: number;    // Affects base MP stat
    spelldmg?: number; // Affects base DMG stat
  };
  value: number;
  rarity: number; // 1 = Normal, 2 = Enchanted, 3 = Legendary
  icon?: string; // We can add this later for visual representation
  classes: number; // Bitmask for class restrictions
  casttime: number;
  mana: number;
  manaregen: number;
}

// All items from the CSV data
export const items: Item[] = [
  // Normal version - Orb of Mastery
  {
    id: 28034,
    name: "Orb of Mastery",
    type: 3,
    slot: SLOT_BITMASKS.PRIMARY,  // 8192
    defense: 0,
    stats: {
      strength: 15,    // astr: 15
      stamina: 10,     // asta: 10
      dexterity: 5,    // adex: 5
      intelligence: 20, // aint: 20
      poison_resist: 0,
      magic_resist: 10, // mr: 10
      disease_resist: 5, // dr: 5
      fire_resist: 20,  // fr: 20
      cold_resist: 20,  // cr: 20
      hp: 0,
      mana: 100,       // mana: 100
      spelldmg: 20     // damage: 20
    },
    value: 100,
    rarity: 1,
    classes: 4096,  // Magician only
    casttime: 20000,
    mana: 100,
    manaregen: 0
  },
  // Enchanted version - Orb of Mastery
  {
    id: 1028034,
    name: "Orb of Mastery (Enchanted)",
    type: 3,
    slot: SLOT_BITMASKS.PRIMARY,  // 8192
    defense: 0,
    stats: {
      strength: 30,     // astr: 30
      stamina: 20,      // asta: 20
      dexterity: 10,    // adex: 10
      intelligence: 40,  // aint: 40
      attack: 5,        // attack: 5
      poison_resist: 0,
      magic_resist: 20,  // mr: 20
      disease_resist: 5, // dr: 5
      fire_resist: 40,   // fr: 40
      cold_resist: 40,   // cr: 40
      hp: 0,
      mana: 200,        // mana: 200
      spelldmg: 40      // damage: 40
    },
    heroic_stats: {
      spelldmg: 20      // spelldmg: 20
    },
    value: 200,
    rarity: 2,
    classes: 4096,  // Magician only
    casttime: 5000,
    mana: 200,
    manaregen: 0
  },
  // Legendary version - Orb of Mastery
  {
    id: 2028034,
    name: "Orb of Mastery (Legendary)",
    type: 3,
    slot: SLOT_BITMASKS.PRIMARY,  // 8192
    defense: 0,
    stats: {
      strength: 30,     // astr: 30
      stamina: 20,      // asta: 20
      dexterity: 10,    // adex: 10
      intelligence: 40,  // aint: 40
      accuracy: 3,      // accuracy: 3
      attack: 10,       // attack: 10
      poison_resist: 0,
      magic_resist: 20,  // mr: 20
      disease_resist: 4, // dr: 4
      fire_resist: 40,   // fr: 40
      cold_resist: 40,   // cr: 40
      hp: 0,
      mana: 200,        // mana: 200
      spelldmg: 40      // damage: 40
    },
    heroic_stats: {
      strength: 8,      // heroic_str: 8
      stamina: 5,       // heroic_sta: 5
      intelligence: 10,  // heroic_int: 10
      dexterity: 3,     // heroic_dex: 3
      magic_resist: 5,   // heroic_mr: 5
      fire_resist: 10,   // heroic_fr: 10
      cold_resist: 10,   // heroic_cr: 10
      spelldmg: 40      // spelldmg: 40
    },
    value: 200,
    rarity: 3,
    classes: 4096,  // Magician only
    casttime: 2500,
    mana: 200,
    manaregen: 0
  },
  // Normal version - Sal`Varae's Robe
  {
    id: 31239,
    name: "Sal`Varae's Robe of Darkness",
    type: 0,
    slot: SLOT_BITMASKS.CHEST,  // 131072
    defense: 60,
    stats: {
      strength: 15,
      stamina: 25,
      agility: 25,
      intelligence: 25,
      wisdom: 25,
      dexterity: 15,
      charisma: 25,
      poison_resist: 15,
      magic_resist: 15,
      disease_resist: 15,
      fire_resist: 15,
      cold_resist: 15,
      hp: 0,
      mana: 100,
      spelldmg: 0
    },
    value: 100,
    rarity: 1,
    classes: 15362,
    casttime: 0,
    mana: 100,
    manaregen: 3
  },
  // Enchanted version - Sal`Varae's Robe
  {
    id: 1031239,
    name: "Sal`Varae's Robe of Darkness (Enchanted)",
    type: 0,
    slot: SLOT_BITMASKS.CHEST,  // 131072
    defense: 120,
    stats: {
      strength: 30,
      stamina: 50,
      agility: 50,
      intelligence: 50,
      wisdom: 50,
      dexterity: 30,
      charisma: 50,
      attack: 8,
      poison_resist: 30,
      magic_resist: 30,
      disease_resist: 30,
      fire_resist: 30,
      cold_resist: 30,
      hp: 0,
      mana: 200,
      spelldmg: 25  // Base spell damage
    },
    heroic_stats: {
      healamt: 25,
      spelldmg: 25  // Heroic spell damage
    },
    value: 200,
    rarity: 2,
    classes: 15362,
    casttime: 0,
    mana: 200,
    manaregen: 5
  },
  // Legendary version - Sal`Varae's Robe
  {
    id: 2031239,
    name: "Sal`Varae's Robe of Darkness (Legendary)",
    type: 0,
    slot: SLOT_BITMASKS.CHEST,  // 131072
    defense: 120,
    stats: {
      strength: 30,
      stamina: 50,
      agility: 50,
      intelligence: 50,
      wisdom: 50,
      dexterity: 30,
      charisma: 50,
      accuracy: 8,
      attack: 15,
      poison_resist: 30,
      magic_resist: 30,
      disease_resist: 30,
      fire_resist: 30,
      cold_resist: 30,
      hp: 0,
      mana: 200,
      spelldmg: 50  // Base spell damage
    },
    heroic_stats: {
      strength: 8,
      intelligence: 13,
      wisdom: 13,
      agility: 13,
      dexterity: 8,
      stamina: 13,
      charisma: 13,
      poison_resist: 8,
      disease_resist: 8,
      fire_resist: 8,
      cold_resist: 8,
      magic_resist: 8,
      healamt: 50,
      spelldmg: 50  // Heroic spell damage
    },
    value: 200,
    rarity: 3,
    classes: 15362,
    casttime: 0,
    mana: 200,
    manaregen: 6
  }
]; 