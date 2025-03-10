'use client'

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import { useState, useEffect } from "react"
import { EQUIPMENT_ICONS, type EquipmentSlot as EquipmentSlotType } from "../lib/equipment-icons"
import { items, type Item } from "../src/types/Item"

// Define slot positions in a 4x6 grid
const EQUIPMENT_LAYOUT = {
  row1: [
    { id: "EarLeft", col: 1 },
    { id: "Head", col: 2 },
    { id: "Face", col: 3 },
    { id: "EarRight", col: 4 }
  ],
  row2: [
    { id: "Chest", col: 1 },
    { id: "Neck", col: 4 }
  ],
  row3: [
    { id: "Arms", col: 1 },
    { id: "Back", col: 4 }
  ],
  row4: [
    { id: "Waist", col: 1 },
    { id: "Shoulder", col: 4 }
  ],
  row5: [
    { id: "BracerLeft", col: 1 },
    { id: "BracerRight", col: 4 }
  ],
  row6: [
    { id: "Legs", col: 1 },
    { id: "Hands", col: 2 },
    { id: "Charm", col: 3 },
    { id: "Feet", col: 4 }
  ],
  row7: [
    { id: "RingLeft", col: 2 },
    { id: "RingRight", col: 3 },
    { id: "Powersource", col: 4 }
  ],
  row8: [
    { id: "Primary", col: 1 },
    { id: "Secondary", col: 2 },
    { id: "Range", col: 3 },
    { id: "Ammo", col: 4 }
  ]
}

// Map slot names to item slot bitmasks
const SLOT_MAPPING = {
  "Charm": 1,          // Slot 0
  "EarLeft": 2,        // Slot 1
  "Head": 4,          // Slot 2
  "Face": 8,          // Slot 3
  "EarRight": 16,     // Slot 4
  "Neck": 32,         // Slot 5
  "Shoulder": 64,     // Slot 6
  "Arms": 128,        // Slot 7
  "Back": 256,        // Slot 8
  "BracerLeft": 512,  // Slot 9
  "BracerRight": 1024, // Slot 10
  "Range": 2048,      // Slot 11
  "Hands": 4096,      // Slot 12
  "Primary": 8192,    // Slot 13
  "Secondary": 16384, // Slot 14
  "RingLeft": 32768,  // Slot 15
  "RingRight": 65536, // Slot 16
  "Chest": 131072,    // Slot 17
  "Legs": 262144,    // Slot 18
  "Feet": 524288,    // Slot 19
  "Waist": 1048576,  // Slot 20
  "Powersource": 2097152, // Slot 21
  "Ammo": 4194304    // Slot 22
} as const;

// Add slot name mapping at the top of the file
const SLOT_NAMES: { [key: number]: string } = {
  0: "Charm",
  1: "Left Ear",
  2: "Head",
  3: "Face",
  4: "Right Ear",
  5: "Neck",
  6: "Shoulder",
  7: "Arms",
  8: "Back",
  9: "Left Bracer",
  10: "Right Bracer",
  11: "Range",
  12: "Hands",
  13: "Primary",
  14: "Secondary",
  15: "Left Ring",
  16: "Right Ring",
  17: "Chest",
  18: "Legs",
  19: "Feet",
  20: "Waist",
  21: "Powersource",
  22: "Ammo"
};

// Add class bitmask constants at the top level
const CLASS_BITMASKS = {
  Warrior: 1,
  Cleric: 2,
  Paladin: 4,
  Ranger: 8,
  "Shadow Knight": 16,
  Druid: 32,
  Monk: 64,
  Bard: 128,
  Rogue: 256,
  Shaman: 512,
  Necromancer: 1024,
  Wizard: 2048,
  Magician: 4096,
  Enchanter: 8192,
  Beastlord: 16384,
  Berserker: 32768
} as const;

// Add slot filter mapping that consolidates paired slots
const SLOT_FILTER_NAMES: { [key: number]: string } = {
  0: "Charm",
  1: "Ear",      // Combines both ear slots
  2: "Head",
  3: "Face",
  5: "Neck",
  6: "Shoulder",
  7: "Arms",
  8: "Back",
  9: "Bracer",   // Combines both bracer slots
  11: "Range",
  12: "Hands",
  13: "Primary",
  14: "Secondary",
  15: "Ring",    // Combines both ring slots
  17: "Chest",
  18: "Legs",
  19: "Feet",
  20: "Waist",
  21: "Powersource",
  22: "Ammo"
};

const CHARACTER_CLASSES = [
  "Magician", "Bard", "Beastlord", "Berserker", "Cleric", 
  "Druid", "Enchanter", "Monk", "Necromancer", "Paladin", 
  "Ranger", "Rogue", "Shadow Knight", "Shaman", "Warrior", "Wizard"
];

// Helper function to get classes that can use an item
function getUsableClasses(classesBitmask: number): string[] {
  if (classesBitmask === 65535) return ["All Classes"];
  
  return Object.entries(CLASS_BITMASKS)
    .filter(([_, mask]) => (classesBitmask & mask) !== 0)
    .map(([className]) => className);
}

// Helper function to check if any selected class can use the item
function canClassesUseItem(selectedClasses: string[], itemClassesBitmask: number): boolean {
  if (itemClassesBitmask === 65535) return true;
  
  return selectedClasses.some(className => 
    (itemClassesBitmask & CLASS_BITMASKS[className as keyof typeof CLASS_BITMASKS]) !== 0
  );
}

// Update the canEquipInSlot function to use the new slot names
const canEquipInSlot = (itemSlot: number, targetSlotId: string) => {
  // Handle paired slots (items can go in either slot)
  if (itemSlot === SLOT_MAPPING.EarLeft || itemSlot === SLOT_MAPPING.EarRight) { // Ear slots
    return targetSlotId === "EarLeft" || targetSlotId === "EarRight";
  }
  if (itemSlot === SLOT_MAPPING.BracerLeft || itemSlot === SLOT_MAPPING.BracerRight) { // Bracer slots
    return targetSlotId === "BracerLeft" || targetSlotId === "BracerRight";
  }
  if (itemSlot === SLOT_MAPPING.RingLeft || itemSlot === SLOT_MAPPING.RingRight) { // Ring slots
    return targetSlotId === "RingLeft" || targetSlotId === "RingRight";
  }
  
  // For other slots, check exact match
  return itemSlot === SLOT_MAPPING[targetSlotId as keyof typeof SLOT_MAPPING];
};

function ItemTooltip({ item }: { item: Item }) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black/90 rounded-lg text-white text-xs z-50 pointer-events-none">
      <div className="font-medium text-sm mb-1">{item.name}</div>
      <div className="space-y-1">
        <div className="flex justify-between text-muted-foreground">
          <span>Slot:</span>
          <span>{SLOT_NAMES[item.slot]}</span>
        </div>
        <div className="flex justify-between">
          <span>Defense:</span>
          <span>{item.defense}</span>
        </div>
        {Object.entries(item.stats).map(([stat, value]) => (
          value ? (
            <div key={stat} className="flex justify-between">
              <span className="capitalize">{stat}:</span>
              <span>+{value}</span>
            </div>
          ) : null
        ))}
        {item.heroic_stats && Object.entries(item.heroic_stats).map(([stat, value]) => (
          value ? (
            <div key={stat} className="flex justify-between text-yellow-400">
              <span className="capitalize">{stat.replace(/_/g, ' ')}:</span>
              <span>H: {value}</span>
            </div>
          ) : null
        ))}
        <div className="flex justify-between">
          <span>Value:</span>
          <span>{item.value}</span>
        </div>
        <div className="flex justify-between">
          <span>Rarity:</span>
          <span className={
            item.rarity === 3 ? "text-orange-400" :
            item.rarity === 2 ? "text-blue-400" :
            "text-gray-400"
          }>
            {item.rarity === 3 ? "Legendary" :
             item.rarity === 2 ? "Enchanted" :
             "Normal"}
          </span>
        </div>
        <div className="border-t border-white/20 mt-1 pt-1">
          <div className="text-xs text-muted-foreground">
            <span>Usable by: </span>
            <span className="text-white">{getUsableClasses(item.classes).join(", ")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EquipmentBuilder() {
  const [equipped, setEquipped] = useState<Record<string, Item>>({})
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["Magician"])
  const [isClassesOpen, setIsClassesOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [selectedRarity, setSelectedRarity] = useState<number | null>(null)
  const [selectedStat, setSelectedStat] = useState<string | null>(null)
  
  // Store the initial stats separately and never modify them
  const initialStats = {
    health: { hp: 49, mp: 23, en: 18 },
    combat: { ac: 28, mit: 2, avd: 15, atk: 14, dmg: 10, heal: 5 },
    attributes: { str: 55, sta: 65, agi: 71, dex: 70, wis: 107, int: 115, cha: 115 },
    resistances: { poison: 10, magic: 15, disease: 8, fire: 12, cold: 12 }
  }

  // Track bonus stats from equipment separately
  const [bonusStats, setBonusStats] = useState({
    health: { hp: 0, mp: 0, en: 0 },
    combat: { ac: 0, mit: 0, avd: 0, atk: 0, dmg: 0, heal: 0 },
    attributes: { str: 0, sta: 0, agi: 0, dex: 0, wis: 0, int: 0, cha: 0 },
    resistances: { poison: 0, magic: 0, disease: 0, fire: 0, cold: 0 },
    heroic: {
      str: 0, sta: 0, agi: 0, dex: 0, wis: 0, int: 0, cha: 0,
      poison: 0, magic: 0, disease: 0, fire: 0, cold: 0
    }
  })
  
  // Calculate total stats by combining initial and bonus stats
  const totalStats = {
    health: {
      hp: initialStats.health.hp + bonusStats.health.hp,
      mp: initialStats.health.mp + bonusStats.health.mp,
      en: initialStats.health.en + bonusStats.health.en,
    },
    combat: {
      ac: initialStats.combat.ac + bonusStats.combat.ac,
      mit: initialStats.combat.mit + bonusStats.combat.mit,
      avd: initialStats.combat.avd + bonusStats.combat.avd,
      atk: initialStats.combat.atk + bonusStats.combat.atk,
      dmg: initialStats.combat.dmg + bonusStats.combat.dmg,
      heal: initialStats.combat.heal + bonusStats.combat.heal,
    },
    attributes: {
      str: initialStats.attributes.str + bonusStats.attributes.str,
      sta: initialStats.attributes.sta + bonusStats.attributes.sta,
      agi: initialStats.attributes.agi + bonusStats.attributes.agi,
      dex: initialStats.attributes.dex + bonusStats.attributes.dex,
      wis: initialStats.attributes.wis + bonusStats.attributes.wis,
      int: initialStats.attributes.int + bonusStats.attributes.int,
      cha: initialStats.attributes.cha + bonusStats.attributes.cha,
    },
    resistances: {
      poison: initialStats.resistances.poison + bonusStats.resistances.poison,
      magic: initialStats.resistances.magic + bonusStats.resistances.magic,
      disease: initialStats.resistances.disease + bonusStats.resistances.disease,
      fire: initialStats.resistances.fire + bonusStats.resistances.fire,
      cold: initialStats.resistances.cold + bonusStats.resistances.cold,
    }
  }

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    // Check if any filter is active
    const hasActiveFilter = searchTerm || selectedSlot !== null || selectedRarity !== null || selectedStat !== null;
    if (!hasActiveFilter) {
      return false;
    }

    // Search term filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Slot filter with paired slots
    if (selectedSlot !== null) {
      if (selectedSlot === 1) { // Ear slots
        if (item.slot !== SLOT_MAPPING.EarLeft && item.slot !== SLOT_MAPPING.EarRight) {
          return false;
        }
      } else if (selectedSlot === 9) { // Bracer slots
        if (item.slot !== SLOT_MAPPING.BracerLeft && item.slot !== SLOT_MAPPING.BracerRight) {
          return false;
        }
      } else if (selectedSlot === 15) { // Ring slots
        if (item.slot !== SLOT_MAPPING.RingLeft && item.slot !== SLOT_MAPPING.RingRight) {
          return false;
        }
      } else {
        // For other slots, check if the item can be equipped in this slot
        const slotBitmask = 1 << selectedSlot;
        if ((item.slot & slotBitmask) === 0) { // Use bitwise AND to check if slot is supported
          return false;
        }
      }
    }

    // Rarity filter
    if (selectedRarity !== null && item.rarity !== selectedRarity) {
      return false;
    }

    // Stat filter
    if (selectedStat) {
      const hasSelectedStat = item.stats && item.stats[selectedStat as keyof typeof item.stats];
      if (!hasSelectedStat) {
        return false;
      }
    }

    return true;
  })

  // Get unique stats for filter dropdown
  const availableStats = Array.from(new Set(
    items.flatMap(item => 
      Object.entries(item.stats)
        .filter(([_, value]) => value > 0)
        .map(([stat]) => stat)
    )
  )).sort()

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const item = items.find(i => i.name === active.id)
    if (!item) return

    const targetSlot = over.id as keyof typeof SLOT_MAPPING

    // Check if item can be equipped in this slot using the new helper function
    if (!canEquipInSlot(item.slot, targetSlot)) return

    // Check if any selected class can use this item
    if (!canClassesUseItem(selectedClasses, item.classes)) return

    setEquipped(prev => ({ ...prev, [over.id]: item }))
    
    // Recalculate stats
    updateStats()
  }

  const removeItem = (slotId: string) => {
    setEquipped(prev => {
      const newEquipped = { ...prev }
      delete newEquipped[slotId]
      return newEquipped
    })
    updateStats()
  }

  const updateStats = () => {
    // Start with zero bonus stats
    const newBonusStats = {
      health: { hp: 0, mp: 0, en: 0 },
      combat: { ac: 0, mit: 0, avd: 0, atk: 0, dmg: 0, heal: 0 },
      attributes: { str: 0, sta: 0, agi: 0, dex: 0, wis: 0, int: 0, cha: 0 },
      resistances: { poison: 0, magic: 0, disease: 0, fire: 0, cold: 0 },
      heroic: {
        str: 0, sta: 0, agi: 0, dex: 0, wis: 0, int: 0, cha: 0,
        poison: 0, magic: 0, disease: 0, fire: 0, cold: 0
      }
    }

    // Add up all bonuses from equipped items
    Object.values(equipped).forEach(item => {
      if (!item) return
      
      // Add defense to AC
      newBonusStats.combat.ac += item.defense

      // Add regular stats
      if (item.stats) {
        if (item.stats.strength) newBonusStats.attributes.str += item.stats.strength
        if (item.stats.stamina) newBonusStats.attributes.sta += item.stats.stamina
        if (item.stats.agility) newBonusStats.attributes.agi += item.stats.agility
        if (item.stats.intelligence) newBonusStats.attributes.int += item.stats.intelligence
        if (item.stats.wisdom) newBonusStats.attributes.wis += item.stats.wisdom
      }

      // Add heroic stats
      if (item.heroic_stats) {
        if (item.heroic_stats.strength) newBonusStats.heroic.str += item.heroic_stats.strength
        if (item.heroic_stats.stamina) newBonusStats.heroic.sta += item.heroic_stats.stamina
        if (item.heroic_stats.agility) newBonusStats.heroic.agi += item.heroic_stats.agility
        if (item.heroic_stats.dexterity) newBonusStats.heroic.dex += item.heroic_stats.dexterity
        if (item.heroic_stats.wisdom) newBonusStats.heroic.wis += item.heroic_stats.wisdom
        if (item.heroic_stats.intelligence) newBonusStats.heroic.int += item.heroic_stats.intelligence
        if (item.heroic_stats.charisma) newBonusStats.heroic.cha += item.heroic_stats.charisma
        if (item.heroic_stats.poison_resist) newBonusStats.heroic.poison += item.heroic_stats.poison_resist
        if (item.heroic_stats.magic_resist) newBonusStats.heroic.magic += item.heroic_stats.magic_resist
        if (item.heroic_stats.disease_resist) newBonusStats.heroic.disease += item.heroic_stats.disease_resist
        if (item.heroic_stats.fire_resist) newBonusStats.heroic.fire += item.heroic_stats.fire_resist
        if (item.heroic_stats.cold_resist) newBonusStats.heroic.cold += item.heroic_stats.cold_resist
      }
    })

    setBonusStats(newBonusStats)
  }

  // Update the useEffect to run when equipped changes
  useEffect(() => {
    updateStats()
  }, [equipped]) // Add equipped to dependency array

  const toggleClass = (cls: string) => {
    setSelectedClasses(prev => {
      if (prev.includes(cls)) {
        return prev.filter(c => c !== cls)
      }
      if (prev.length >= 3) {
        return prev
      }
      return [...prev, cls]
    })
  }

  return (
    <div className="flex gap-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="bg-card text-card-foreground p-4 rounded-lg border w-[900px]">
          <h2 className="text-center text-lg font-bold border-b pb-2">Character Equipment</h2>
          
          <div className="my-4">
            <button 
              onClick={() => setIsClassesOpen(!isClassesOpen)}
              className="w-full flex items-center justify-between px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <span className="font-medium">
                Classes ({selectedClasses.length}/3): {selectedClasses.join(", ")}
              </span>
              <svg 
                className={`w-5 h-5 transition-transform ${isClassesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isClassesOpen && (
              <div className="grid grid-cols-4 gap-2 mt-2 mx-auto max-w-[600px]">
                {CHARACTER_CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`px-3 py-2 rounded text-sm transition-colors ${
                      selectedClasses.includes(cls)
                        ? "bg-primary text-primary-foreground"
                        : selectedClasses.length >= 3 && !selectedClasses.includes(cls)
                          ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                          : "bg-muted hover:bg-muted/80"
                    }`}
                    disabled={selectedClasses.length >= 3 && !selectedClasses.includes(cls)}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-[20px]">
            <div className="p-4 border rounded bg-border w-[400px] ml-[100px]">
              <div className="text-base bg-card p-6 rounded">
                <div className="flex gap-8">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Health</p>
                    <p className="text-lg font-medium">HP: {totalStats.health.hp}</p>
                    <p className="text-lg font-medium">MP: {totalStats.health.mp}</p>
                    <p className="text-lg font-medium">EN: {totalStats.health.en}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Combat</p>
                    <p className={`text-lg font-medium ${bonusStats.combat.ac > 0 ? "text-green-500" : ""}`}>
                      AC: {totalStats.combat.ac}
                    </p>
                    <p className="text-lg font-medium">MIT: {totalStats.combat.mit}</p>
                    <p className="text-lg font-medium">AVD: {totalStats.combat.avd}</p>
                    <p className="text-lg font-medium">ATK: {totalStats.combat.atk}</p>
                    <p className="text-lg font-medium">DMG: {totalStats.combat.dmg}</p>
                    <p className="text-lg font-medium">HEAL: {totalStats.combat.heal}</p>
                  </div>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex gap-8">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Attributes</p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.str > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">STR: {totalStats.attributes.str}</span>
                      {bonusStats.heroic.str > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.str}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.sta > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">STA: {totalStats.attributes.sta}</span>
                      {bonusStats.heroic.sta > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.sta}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.agi > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">AGI: {totalStats.attributes.agi}</span>
                      {bonusStats.heroic.agi > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.agi}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.dex > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">DEX: {totalStats.attributes.dex}</span>
                      {bonusStats.heroic.dex > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.dex}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.wis > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">WIS: {totalStats.attributes.wis}</span>
                      {bonusStats.heroic.wis > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.wis}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.int > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">INT: {totalStats.attributes.int}</span>
                      {bonusStats.heroic.int > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.int}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.attributes.cha > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">CHA: {totalStats.attributes.cha}</span>
                      {bonusStats.heroic.cha > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.cha}</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Resistances</p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.resistances.poison > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">POISON: {totalStats.resistances.poison}</span>
                      {bonusStats.heroic.poison > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.poison}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.resistances.magic > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">MAGIC: {totalStats.resistances.magic}</span>
                      {bonusStats.heroic.magic > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.magic}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.resistances.disease > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">DISEASE: {totalStats.resistances.disease}</span>
                      {bonusStats.heroic.disease > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.disease}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.resistances.fire > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">FIRE: {totalStats.resistances.fire}</span>
                      {bonusStats.heroic.fire > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.fire}</span>}
                    </p>
                    <p className={`text-lg font-medium flex items-center gap-4 ${bonusStats.resistances.cold > 0 ? "text-green-500" : ""}`}>
                      <span className="w-24">COLD: {totalStats.resistances.cold}</span>
                      {bonusStats.heroic.cold > 0 && <span className="text-yellow-400">H: {bonusStats.heroic.cold}</span>}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsStatsModalOpen(true)}
                  className="w-full mt-6 px-4 py-2 bg-muted hover:bg-muted/80 rounded transition-colors"
                >
                  Set Base Stats
                </button>
              </div>
            </div>

            {/* Stats Modal */}
            {isStatsModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-card p-6 rounded-lg shadow-lg w-[600px] max-h-[80vh] overflow-y-auto border-4 border-border">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b">
                    <h3 className="text-lg font-bold">Set Base Stats</h3>
                    <button
                      onClick={() => setIsStatsModalOpen(false)}
                      className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
                    >
                      Save & Close
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {/* Health Section */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                      <p className="font-medium mb-2">Health</p>
                      <div className="space-y-2">
                        {Object.entries(initialStats.health).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBonusStats(prev => ({
                                ...prev,
                                health: { ...prev.health, [key]: parseInt(e.target.value) || 0 }
                              }))}
                              className="w-20 px-2 py-1 bg-card rounded border border-border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Combat Section */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                      <p className="font-medium mb-2">Combat</p>
                      <div className="space-y-2">
                        {Object.entries(initialStats.combat).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBonusStats(prev => ({
                                ...prev,
                                combat: { ...prev.combat, [key]: parseInt(e.target.value) || 0 }
                              }))}
                              className="w-20 px-2 py-1 bg-card rounded border border-border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attributes Section */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                      <p className="font-medium mb-2">Attributes</p>
                      <div className="space-y-2">
                        {Object.entries(initialStats.attributes).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBonusStats(prev => ({
                                ...prev,
                                attributes: { ...prev.attributes, [key]: parseInt(e.target.value) || 0 }
                              }))}
                              className="w-20 px-2 py-1 bg-card rounded border border-border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resistances Section */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                      <p className="font-medium mb-2">Resistances</p>
                      <div className="space-y-2">
                        {Object.entries(initialStats.resistances).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBonusStats(prev => ({
                                ...prev,
                                resistances: { ...prev.resistances, [key]: parseInt(e.target.value) || 0 }
                              }))}
                              className="w-20 px-2 py-1 bg-card rounded border border-border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border rounded bg-border h-fit ml-auto mr-[50px]">
              <div className="grid" style={{ 
                gridTemplateColumns: 'repeat(4, 64px)',
                gap: '2px',
                width: 'fit-content',
                margin: '0',
                background: 'var(--border)'
              }}>
                {/* Row 1 */}
                {EQUIPMENT_LAYOUT.row1.map((slot) => (
                  <EquipmentSlot 
                    key={slot.id} 
                    id={slot.id} 
                    equippedItem={equipped[slot.id]} 
                    onRemove={removeItem}
                  />
                ))}
                
                {/* Row 2 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row2[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row2[0].id]} onRemove={removeItem} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row2[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row2[1].id]} onRemove={removeItem} />
                
                {/* Row 3 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row3[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row3[0].id]} onRemove={removeItem} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row3[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row3[1].id]} onRemove={removeItem} />
                
                {/* Row 4 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row4[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row4[0].id]} onRemove={removeItem} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row4[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row4[1].id]} onRemove={removeItem} />
                
                {/* Row 5 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row5[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row5[0].id]} onRemove={removeItem} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row5[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row5[1].id]} onRemove={removeItem} />
                
                {/* Row 6 */}
                {EQUIPMENT_LAYOUT.row6.map((slot) => (
                  <EquipmentSlot 
                    key={slot.id} 
                    id={slot.id} 
                    equippedItem={equipped[slot.id]} 
                    onRemove={removeItem}
                  />
                ))}
                
                {/* Row 7 */}
                <div className="w-16 h-16 bg-transparent" />
                {EQUIPMENT_LAYOUT.row7.map((slot) => (
                  <EquipmentSlot 
                    key={slot.id} 
                    id={slot.id} 
                    equippedItem={equipped[slot.id]} 
                    onRemove={removeItem}
                  />
                ))}
                
                {/* Row 8 */}
                {EQUIPMENT_LAYOUT.row8.map((slot) => (
                  <EquipmentSlot 
                    key={slot.id} 
                    id={slot.id} 
                    equippedItem={equipped[slot.id]} 
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border w-[300px]">
          <h2 className="text-center text-lg font-bold border-b pb-2">Available Items</h2>
          
          {/* Search and Filters */}
          <div className="space-y-2 mt-4">
            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-lg border border-border text-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {/* Slot filter */}
              <select
                value={selectedSlot ?? ""}
                onChange={(e) => setSelectedSlot(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-2 py-1 bg-muted rounded border border-border text-sm"
              >
                <option value="">All Slots</option>
                {Object.entries(SLOT_FILTER_NAMES).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>

              {/* Rarity filter */}
              <select
                value={selectedRarity ?? ""}
                onChange={(e) => setSelectedRarity(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-2 py-1 bg-muted rounded border border-border text-sm"
              >
                <option value="">All Rarities</option>
                <option value="1">Normal</option>
                <option value="2">Enchanted</option>
                <option value="3">Legendary</option>
              </select>
            </div>

            {/* Stats filter */}
            <select
              value={selectedStat ?? ""}
              onChange={(e) => setSelectedStat(e.target.value || null)}
              className="w-full px-2 py-1 bg-muted rounded border border-border text-sm"
            >
              <option value="">All Stats</option>
              {availableStats.map(stat => (
                <option key={stat} value={stat} className="capitalize">{stat}</option>
              ))}
            </select>

            {/* Active filters display */}
            {(searchTerm || selectedSlot || selectedRarity || selectedStat) && (
              <div className="flex flex-wrap gap-1 pt-2">
                {/* Clear all filters button */}
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedSlot(null)
                    setSelectedRarity(null)
                    setSelectedStat(null)
                  }}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20"
                >
                  Clear All Filters
                </button>
                
                {/* Show active filters */}
                {selectedSlot && (
                  <div className="px-2 py-1 bg-muted text-xs rounded-full">
                    Slot: {SLOT_FILTER_NAMES[selectedSlot]}
                  </div>
                )}
                {selectedRarity && (
                  <div className="px-2 py-1 bg-muted text-xs rounded-full">
                    Rarity: {selectedRarity === 3 ? "Legendary" : selectedRarity === 2 ? "Enchanted" : "Normal"}
                  </div>
                )}
                {selectedStat && (
                  <div className="px-2 py-1 bg-muted text-xs rounded-full capitalize">
                    Stat: {selectedStat}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-3 gap-[2px] mt-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <DraggableItem key={item.id} item={item} selectedClasses={selectedClasses} />
              ))
            ) : (
              <div className="col-span-3 py-8 text-center text-muted-foreground">
                {searchTerm || selectedSlot !== null || selectedRarity !== null || selectedStat !== null
                  ? "No items match your filters"
                  : "Select at least one filter to view items"}
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  )
}

function EquipmentSlot({ 
  id, 
  equippedItem, 
  onRemove 
}: { 
  id: string; 
  equippedItem?: Item;
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver, active } = useDroppable({ id })
  const iconPath = EQUIPMENT_ICONS[id as EquipmentSlotType]
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Check if the dragged item can be equipped in this slot
  const canEquip = active ? (() => {
    const item = items.find(i => i.name === active.id)
    if (!item) return false
    return canEquipInSlot(item.slot, id)
  })() : false

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 flex items-center justify-center text-xs text-center relative ${
        isOver 
          ? canEquip
            ? "bg-green-500/20" 
            : "bg-red-500/20"
          : "bg-card"
      }`}
    >
      {equippedItem ? (
        <div 
          className="relative w-full h-full flex items-center justify-center group"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {iconPath && (
            <img 
              src={iconPath} 
              alt={id} 
              className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
            />
          )}
          <span className="text-[10px] leading-tight px-0.5 w-full text-center break-words relative z-10">
            {equippedItem.name}
          </span>
          <button
            onClick={() => onRemove(id)}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-destructive text-destructive-foreground 
              flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            ×
          </button>
          {showTooltip && <ItemTooltip item={equippedItem} />}
        </div>
      ) : (
        iconPath && (
          <img 
            src={iconPath} 
            alt={id} 
            className="w-8 h-8 opacity-30"
          />
        )
      )}
    </div>
  )
}

function DraggableItem({ item, selectedClasses }: { item: Item; selectedClasses: string[] }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.name,
  })
  const [showTooltip, setShowTooltip] = useState(false)
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  const rarityColors = {
    1: "border-gray-400",  // Normal items get gray border
    2: "border-blue-400",  // Enchanted items
    3: "border-orange-400" // Legendary items
  }

  const borderClass = rarityColors[item.rarity as keyof typeof rarityColors]

  // Get the icon path based on the item's slot
  const getSlotIcon = () => {
    // Convert item slot bitmask to slot name using bitwise operations
    if (item.slot & SLOT_MAPPING.Head) return EQUIPMENT_ICONS.Head;
    if (item.slot & SLOT_MAPPING.Face) return EQUIPMENT_ICONS.Face;
    if (item.slot & (SLOT_MAPPING.EarLeft | SLOT_MAPPING.EarRight)) return EQUIPMENT_ICONS.EarLeft;
    if (item.slot & SLOT_MAPPING.Neck) return EQUIPMENT_ICONS.Neck;
    if (item.slot & SLOT_MAPPING.Chest) return EQUIPMENT_ICONS.Chest;
    if (item.slot & SLOT_MAPPING.Arms) return EQUIPMENT_ICONS.Arms;
    if (item.slot & SLOT_MAPPING.Back) return EQUIPMENT_ICONS.Back;
    if (item.slot & (SLOT_MAPPING.BracerLeft | SLOT_MAPPING.BracerRight)) return EQUIPMENT_ICONS.BracerLeft;
    if (item.slot & SLOT_MAPPING.Hands) return EQUIPMENT_ICONS.Hands;
    if (item.slot & SLOT_MAPPING.Primary) return EQUIPMENT_ICONS.Primary;
    if (item.slot & SLOT_MAPPING.Secondary) return EQUIPMENT_ICONS.Secondary;
    if (item.slot & (SLOT_MAPPING.RingLeft | SLOT_MAPPING.RingRight)) return EQUIPMENT_ICONS.RingLeft;
    if (item.slot & SLOT_MAPPING.Legs) return EQUIPMENT_ICONS.Legs;
    if (item.slot & SLOT_MAPPING.Feet) return EQUIPMENT_ICONS.Feet;
    if (item.slot & SLOT_MAPPING.Waist) return EQUIPMENT_ICONS.Waist;
    if (item.slot & SLOT_MAPPING.Powersource) return EQUIPMENT_ICONS.Powersource;
    if (item.slot & SLOT_MAPPING.Ammo) return EQUIPMENT_ICONS.Ammo;
    if (item.slot & SLOT_MAPPING.Range) return EQUIPMENT_ICONS.Range;
    if (item.slot & SLOT_MAPPING.Charm) return EQUIPMENT_ICONS.Charm;
    return null;
  }

  const iconPath = getSlotIcon()

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-16 h-16 flex items-center justify-center cursor-move border-2 relative
        ${borderClass}
        ${isDragging ? "bg-primary/20" : "bg-card"}
        ${!canClassesUseItem(selectedClasses, item.classes) ? "opacity-50" : ""}
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {iconPath && (
        <img 
          src={iconPath} 
          alt=""
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        />
      )}
      <span className="text-[10px] leading-tight px-0.5 w-full text-center break-words relative z-10">
        {item.name}
      </span>
      {showTooltip && <ItemTooltip item={item} />}
    </div>
  )
} 