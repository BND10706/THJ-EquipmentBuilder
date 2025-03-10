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
    dexterity?: number;
    accuracy?: number;
    attack?: number;
    charisma?: number;
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
  // Head slot items (slot 2)
  {
    id: 1001,
    name: "Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1013,
    name: "Small Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1025,
    name: "Large Cloth Cap",
    type: 0,
    slot: 2,
    defense: 2,
    stats: {},
    value: 200,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1050,
    name: "Rat Fur Cap",
    type: 0,
    slot: 2,
    defense: 1,
    stats: {},
    value: 22,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
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
    rarity: 2,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
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
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1014,
    name: "Small Cloth Veil",
    type: 0,
    slot: 3,
    defense: 1,
    stats: {},
    value: 160,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1026,
    name: "Large Cloth Veil",
    type: 0,
    slot: 3,
    defense: 1,
    stats: {},
    value: 160,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1081,
    name: "Mithril Studded Mask",
    type: 0,
    slot: 3,
    defense: 4,
    stats: {},
    value: 2300,
    rarity: 3,
    classes: 33199, // Berserker + Rogue + Monk + Druid + SK + Ranger + Paladin + Cleric + Warrior
    casttime: 0,
    mana: 0,
    manaregen: 0
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
    rarity: 2,
    classes: 49681, // Warrior + Berserker + Beastlord
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1578,
    name: "Gilded Tiny Skull Earring",
    type: 0,
    slot: 4,
    defense: 5,
    stats: {},
    value: 0,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
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
    rarity: 2,
    classes: 15360, // Magician + Enchanter + Beastlord
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1744,
    name: "Earring of the Frozen Skull",
    type: 0,
    slot: 4,
    defense: 4,
    stats: {},
    value: 150,
    rarity: 1,
    classes: 15906, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Other items with special properties
  {
    id: 5972,
    name: "Hollow Acrylia Obelisk",
    type: 0,
    slot: 12, // Hands slot
    defense: 8,
    stats: {
      strength: 7,
      stamina: 7,
      agility: 0,
      intelligence: 5,
      wisdom: 5
    },
    value: 0,
    rarity: 3,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 35001,
    name: "Intricate Wooden Figurine of Strength",
    type: 0,
    slot: 0, // Charm slot
    defense: 25,
    stats: {
      strength: 15,
      stamina: 15,
      agility: 10,
      intelligence: 0,
      wisdom: 0
    },
    value: 0,
    rarity: 3,
    classes: 1, // Warrior only
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 35002,
    name: "Intricate Wooden Figurine of Wisdom",
    type: 0,
    slot: 0, // Charm slot
    defense: 20,
    stats: {
      strength: 0,
      stamina: 15,
      agility: 10,
      intelligence: 0,
      wisdom: 15
    },
    value: 0,
    rarity: 3,
    classes: 2, // Cleric only
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Wrist slot items (slot 9/10)
  {
    id: 1009,
    name: "Cloth Wristband",
    type: 0,
    slot: 9,
    defense: 1,
    stats: {},
    value: 180,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1021,
    name: "Small Cloth Wristband",
    type: 0,
    slot: 9,
    defense: 1,
    stats: {},
    value: 180,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1033,
    name: "Large Cloth Wristband",
    type: 0,
    slot: 9,
    defense: 1,
    stats: {},
    value: 180,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1088,
    name: "Mithril Studded Wristbands",
    type: 0,
    slot: 9,
    defense: 5,
    stats: {},
    value: 2350,
    rarity: 3,
    classes: 33199, // Berserker + Rogue + Monk + Druid + SK + Ranger + Paladin + Cleric + Warrior
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1109,
    name: "Netted Wristband",
    type: 0,
    slot: 9,
    defense: 1,
    stats: {},
    value: 180,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Sleeve slot items (slot 7)
  {
    id: 1032,
    name: "Large Cloth Sleeves",
    type: 0,
    slot: 7,
    defense: 2,
    stats: {},
    value: 220,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1066,
    name: "Trakanasaur Hide Sleeves",
    type: 0,
    slot: 7,
    defense: 8,
    stats: {
      strength: 5
    },
    value: 2500,
    rarity: 2,
    classes: 33297, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1087,
    name: "Mithril Studded Sleeves",
    type: 0,
    slot: 7,
    defense: 6,
    stats: {},
    value: 2700,
    rarity: 3,
    classes: 33199, // Berserker + Rogue + Monk + Druid + SK + Ranger + Paladin + Cleric + Warrior
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Cape slot items (slot 8)
  {
    id: 1006,
    name: "Cloth Cape",
    type: 0,
    slot: 8,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1018,
    name: "Small Cloth Cape",
    type: 0,
    slot: 8,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1030,
    name: "Large Cloth Cape",
    type: 0,
    slot: 8,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1048,
    name: "Black Leather Cloak",
    type: 0,
    slot: 8,
    defense: 1,
    stats: {
      agility: 2
    },
    value: 1800,
    rarity: 2,
    classes: 33169, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1051,
    name: "Rat Pelt Cape",
    type: 0,
    slot: 8,
    defense: 1,
    stats: {},
    value: 40,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add resistance stones (slot 2048)
  {
    id: 1138,
    name: "White Resistance Stone",
    type: 0,
    slot: 2048,
    defense: 1,
    stats: {
      strength: 1,
      stamina: 1,
      agility: 1,
      intelligence: 1,
      wisdom: 1
    },
    value: 0,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1139,
    name: "Blue Resistance Stone",
    type: 0,
    slot: 2048,
    defense: 1,
    stats: {
      strength: 1,
      stamina: 1,
      agility: 1,
      intelligence: 1,
      wisdom: 1
    },
    value: 0,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1140,
    name: "Red Resistance Stone",
    type: 0,
    slot: 2048,
    defense: 1,
    stats: {
      strength: 1,
      stamina: 1,
      agility: 1,
      intelligence: 1,
      wisdom: 1
    },
    value: 0,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add gloves (slot 4096)
  {
    id: 1010,
    name: "Cloth Gloves",
    type: 0,
    slot: 4096,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1022,
    name: "Small Cloth Gloves",
    type: 0,
    slot: 4096,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1034,
    name: "Large Cloth Gloves",
    type: 0,
    slot: 4096,
    defense: 2,
    stats: {},
    value: 260,
    rarity: 1,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1049,
    name: "Brown Leather Gloves",
    type: 0,
    slot: 4096,
    defense: 1,
    stats: {
      agility: 2
    },
    value: 450,
    rarity: 2,
    classes: 33177, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1054,
    name: "Used Merchants Gloves",
    type: 0,
    slot: 4096,
    defense: 0,
    stats: {},
    value: 5,
    rarity: 1,
    classes: 33161, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add weapons (slots 24576/8192)
  {
    id: 1062,
    name: "Kerran Fishingpole",
    type: 0,
    slot: 8192,
    defense: 0,
    stats: {
      strength: 2
    },
    value: 0,
    rarity: 1,
    classes: 32767, // Most classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1074,
    name: "Ruined Heretic Longsword",
    type: 0,
    slot: 24576,
    defense: 0,
    stats: {},
    value: 30000,
    rarity: 2,
    classes: 32767, // Most classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1094,
    name: "Dirk of the Traitor",
    type: 0,
    slot: 24576,
    defense: 0,
    stats: {
      strength: 4,
      agility: 4,
      stamina: 4
    },
    value: 0,
    rarity: 2,
    classes: 16777, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1097,
    name: "Frostwrath",
    type: 0,
    slot: 8192,
    defense: 20,
    stats: {
      strength: 10,
      intelligence: 5,
      wisdom: 5
    },
    value: 0,
    rarity: 3,
    classes: 20, // Limited classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add shields (slot 16384)
  {
    id: 1044,
    name: "Velium Round Shield",
    type: 0,
    slot: 16384,
    defense: 15,
    stats: {},
    value: 4000,
    rarity: 2,
    classes: 959, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1075,
    name: "Cracked Paineel Shield",
    type: 0,
    slot: 16384,
    defense: 2,
    stats: {},
    value: 28000,
    rarity: 2,
    classes: 991, // Complex combination
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add rings (slot 98304)
  {
    id: 1454,
    name: "Copper Championship Ring",
    type: 0,
    slot: 98304,
    defense: 4,
    stats: {
      strength: 2,
      stamina: 2,
      agility: 2,
      intelligence: 2,
      wisdom: 2,
      dexterity: 2
    },
    value: 0,
    rarity: 2,
    classes: 65535, // All classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },

  // Add Orb of Mastery items
  {
    id: 28034,
    name: "Orb of Mastery",
    type: 0,
    slot: 8192, // Primary slot
    defense: 0,
    stats: {
      strength: 15,
      stamina: 10,
      dexterity: 5,
      intelligence: 20
    },
    value: 0,
    rarity: 1,
    classes: 4096, // Magician only
    casttime: 20000,
    mana: 100,
    manaregen: 0
  },
  {
    id: 1028034,
    name: "Orb of Mastery",
    type: 0,
    slot: 8192, // Primary slot
    defense: 0,
    stats: {
      strength: 30,
      stamina: 20,
      dexterity: 10,
      intelligence: 40,
      attack: 5
    },
    heroic_stats: {
      magic_resist: 20
    },
    value: 0,
    rarity: 2,
    classes: 4096, // Magician only
    casttime: 5000,
    mana: 200,
    manaregen: 0
  },
  {
    id: 2028034,
    name: "Orb of Mastery",
    type: 0,
    slot: 24576, // Can be equipped in either Primary or Secondary hand (8192 + 16384)
    defense: 0,
    stats: {
      strength: 30,
      stamina: 20,
      dexterity: 10,
      intelligence: 40,
      accuracy: 3,
      attack: 10
    },
    heroic_stats: {
      strength: 8,
      intelligence: 10,
      dexterity: 3,
      stamina: 5,
      magic_resist: 5,
      fire_resist: 10,
      cold_resist: 10
    },
    value: 0,
    rarity: 3,
    classes: 4096, // Magician only
    casttime: 2500,
    mana: 200,
    manaregen: 0
  },

  // Add Sal`Varae's Robe of Darkness items
  {
    id: 31239,
    name: "Sal`Varae's Robe of Darkness",
    type: 0,
    slot: 131072, // Chest slot
    defense: 60,
    stats: {
      strength: 15,
      stamina: 25,
      agility: 25,
      intelligence: 25,
      wisdom: 25,
      dexterity: 15,
      charisma: 25
    },
    value: 0,
    rarity: 1,
    classes: 15362, // Limited classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 1031239,
    name: "Sal`Varae's Robe of Darkness",
    type: 0,
    slot: 131072, // Chest slot
    defense: 120,
    stats: {
      strength: 30,
      stamina: 50,
      agility: 50,
      intelligence: 50,
      wisdom: 50,
      dexterity: 30,
      charisma: 50,
      attack: 8
    },
    heroic_stats: {
      magic_resist: 25,
      fire_resist: 25
    },
    value: 0,
    rarity: 2,
    classes: 15362, // Limited classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  },
  {
    id: 2031239,
    name: "Sal`Varae's Robe of Darkness",
    type: 0,
    slot: 131072, // Chest slot
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
      attack: 15
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
      magic_resist: 8
    },
    value: 0,
    rarity: 3,
    classes: 15362, // Limited classes
    casttime: 0,
    mana: 0,
    manaregen: 0
  }
]; 