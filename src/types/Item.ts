export interface Item {
  id: number;
  name: string;
  type: number;
  slot: number;
  defense: number;
  stats: {
    strength?: number;
    agility?: number;
    stamina?: number;
    intelligence?: number;
    wisdom?: number;
  };
  value: number;
  rarity: number; // 1 = Normal, 2 = Enchanted, 3 = Legendary
  icon?: string; // We can add this later for visual representation
}

// All items from the CSV data
export const items: Item[] = [
  // Head slot items (slot 2)
  {
    id: 1001,
    name: "Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1
  },
  {
    id: 1013,
    name: "Small Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1
  },
  {
    id: 1025,
    name: "Large Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1
  },
  {
    id: 1050,
    name: "Rat Fur Cap",
    type: 0,
    slot: 2,
    defense: 1,
    stats: {},
    value: 22,
    rarity: 1
  },
  {
    id: 1063,
    name: "Kerran Tribal Headband",
    type: 0,
    slot: 2,
    defense: 1,
    stats: {
      wisdom: 2
    },
    value: 200,
    rarity: 2
  },

  // Face slot items (slot 3)
  {
    id: 1002,
    name: "Cloth Veil",
    type: 0,
    slot: 3,
    defense: 1,
    stats: {},
    value: 160,
    rarity: 1
  },
  {
    id: 1014,
    name: "Small Cloth Veil",
    type: 0,
    slot: 3,
    defense: 1,
    stats: {},
    value: 160,
    rarity: 1
  },
  {
    id: 1026,
    name: "Large Cloth Veil",
    type: 0,
    slot: 3,
    defense: 1,
    stats: {},
    value: 160,
    rarity: 1
  },
  {
    id: 1081,
    name: "Mithril Studded Mask",
    type: 0,
    slot: 3,
    defense: 4,
    stats: {},
    value: 2300,
    rarity: 3
  },

  // Ear slot items (slot 4)
  {
    id: 1538,
    name: "Earring of Bashing",
    type: 0,
    slot: 4,
    defense: 5,
    stats: {
      strength: 8,
      wisdom: 8
    },
    value: 0,
    rarity: 2
  },
  {
    id: 1578,
    name: "Gilded Tiny Skull Earring",
    type: 0,
    slot: 4,
    defense: 5,
    stats: {},
    value: 0,
    rarity: 1
  },
  {
    id: 1720,
    name: "Helssen's Prismatic Trinket",
    type: 0,
    slot: 4,
    defense: 5,
    stats: {
      agility: 8
    },
    value: 0,
    rarity: 2
  },
  {
    id: 1744,
    name: "Earring of the Frozen Skull",
    type: 0,
    slot: 4,
    defense: 4,
    stats: {},
    value: 150,
    rarity: 1
  },

  // Other items with special properties
  {
    id: 5972,
    name: "Hollow Acrylia Obelisk",
    type: 0,
    slot: 11, // Hands slot
    defense: 8,
    stats: {
      strength: 7,
      stamina: 7,
      agility: 0,
      intelligence: 5,
      wisdom: 5
    },
    value: 0,
    rarity: 3
  },
  {
    id: 35001,
    name: "Intricate Wooden Figurine of Strength",
    type: 0,
    slot: 16, // Charm slot
    defense: 25,
    stats: {
      strength: 15,
      stamina: 15,
      agility: 10,
      intelligence: 0,
      wisdom: 0
    },
    value: 0,
    rarity: 3
  },
  {
    id: 35002,
    name: "Intricate Wooden Figurine of Wisdom",
    type: 0,
    slot: 16, // Charm slot
    defense: 20,
    stats: {
      strength: 0,
      stamina: 15,
      agility: 10,
      intelligence: 0,
      wisdom: 15
    },
    value: 0,
    rarity: 3
  }
]; 