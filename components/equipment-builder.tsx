'use client'

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import { useState, useEffect } from "react"
import { EQUIPMENT_ICONS, type EquipmentSlot as EquipmentSlotType } from "../lib/equipment-icons"
import { items, type Item } from "../src/types/Item"

// Define slot positions in a 4x6 grid
const EQUIPMENT_LAYOUT = {
  row1: [
    { id: "Ear1", col: 1 },
    { id: "Head", col: 2 },
    { id: "Face", col: 3 },
    { id: "Ear2", col: 4 }
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
    { id: "Belt", col: 1 },
    { id: "Shoulders", col: 4 }
  ],
  row5: [
    { id: "Wrist1", col: 1 },
    { id: "Wrist2", col: 4 }
  ],
  row6: [
    { id: "Legs", col: 1 },
    { id: "Hands", col: 2 },
    { id: "Charm", col: 3 },
    { id: "Feet", col: 4 }
  ],
  row7: [
    { id: "Ring1", col: 2 },
    { id: "Ring2", col: 3 },
    { id: "Power", col: 4 }
  ],
  row8: [
    { id: "Primary", col: 1 },
    { id: "Secondary", col: 2 },
    { id: "Range", col: 3 },
    { id: "Ammo", col: 4 }
  ]
}

// Map slot names to item slot numbers
const SLOT_MAPPING = {
  Head: 2,
  Face: 3,
  Ear1: 4,
  Ear2: 4,
  Neck: 5,
  Chest: 6,
  Arms: 7,
  Back: 8,
  Shoulders: 9,
  Wrist1: 10,
  Wrist2: 10,
  Hands: 11,
  Ring1: 12,
  Ring2: 12,
  Belt: 13,
  Legs: 14,
  Feet: 15,
  Charm: 16,
  Power: 17,
  Primary: 18,
  Secondary: 19,
  Range: 20,
  Ammo: 21
} as const;

const CHARACTER_CLASSES = [
  "Magician", "Bard", "Beastlord", "Berserker", "Cleric", 
  "Druid", "Enchanter", "Monk", "Necromancer", "Paladin", 
  "Ranger", "Rogue", "Shadow Knight", "Shaman", "Warrior", "Wizard"
]

// Add slot name mapping at the top of the file
const SLOT_NAMES: { [key: number]: string } = {
  2: "Head",
  3: "Face",
  4: "Ear",
  5: "Neck",
  6: "Chest",
  7: "Arms",
  8: "Back",
  9: "Shoulders",
  10: "Wrist",
  11: "Hands",
  12: "Ring",
  13: "Belt",
  14: "Legs",
  15: "Feet",
  16: "Charm",
  17: "Power",
  18: "Primary",
  19: "Secondary",
  20: "Range",
  21: "Ammo"
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
      </div>
    </div>
  )
}

export function EquipmentBuilder() {
  const [equipped, setEquipped] = useState<Record<string, Item>>({})
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["Magician"])
  const [isClassesOpen, setIsClassesOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  
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
    resistances: { poison: 0, magic: 0, disease: 0, fire: 0, cold: 0 }
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

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const item = items.find(i => i.name === active.id)
    if (!item) return

    const targetSlot = over.id as keyof typeof SLOT_MAPPING
    const requiredSlot = SLOT_MAPPING[targetSlot]

    // Check if item can be equipped in this slot
    if (item.slot !== requiredSlot) return

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
      resistances: { poison: 0, magic: 0, disease: 0, fire: 0, cold: 0 }
    }

    // Add up all bonuses from equipped items
    Object.values(equipped).forEach(item => {
      if (!item) return
      
      // Add defense to AC
      newBonusStats.combat.ac += item.defense

      // Add other stats
      if (item.stats) {
        if (item.stats.strength) newBonusStats.attributes.str += item.stats.strength
        if (item.stats.stamina) newBonusStats.attributes.sta += item.stats.stamina
        if (item.stats.agility) newBonusStats.attributes.agi += item.stats.agility
        if (item.stats.intelligence) newBonusStats.attributes.int += item.stats.intelligence
        if (item.stats.wisdom) newBonusStats.attributes.wis += item.stats.wisdom
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
            <div className="p-4 border rounded bg-border w-[300px] ml-[100px]">
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
                    <p className={`text-lg font-medium ${bonusStats.attributes.str > 0 ? "text-green-500" : ""}`}>
                      STR: {totalStats.attributes.str}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.sta > 0 ? "text-green-500" : ""}`}>
                      STA: {totalStats.attributes.sta}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.agi > 0 ? "text-green-500" : ""}`}>
                      AGI: {totalStats.attributes.agi}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.dex > 0 ? "text-green-500" : ""}`}>
                      DEX: {totalStats.attributes.dex}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.wis > 0 ? "text-green-500" : ""}`}>
                      WIS: {totalStats.attributes.wis}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.int > 0 ? "text-green-500" : ""}`}>
                      INT: {totalStats.attributes.int}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.attributes.cha > 0 ? "text-green-500" : ""}`}>
                      CHA: {totalStats.attributes.cha}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Resistances</p>
                    <p className={`text-lg font-medium ${bonusStats.resistances.poison > 0 ? "text-green-500" : ""}`}>
                      POISON: {totalStats.resistances.poison}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.resistances.magic > 0 ? "text-green-500" : ""}`}>
                      MAGIC: {totalStats.resistances.magic}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.resistances.disease > 0 ? "text-green-500" : ""}`}>
                      DISEASE: {totalStats.resistances.disease}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.resistances.fire > 0 ? "text-green-500" : ""}`}>
                      FIRE: {totalStats.resistances.fire}
                    </p>
                    <p className={`text-lg font-medium ${bonusStats.resistances.cold > 0 ? "text-green-500" : ""}`}>
                      COLD: {totalStats.resistances.cold}
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
          <div className="grid grid-cols-3 gap-[2px] mt-4">
            {items.map((item) => (
              <DraggableItem key={item.id} item={item} />
            ))}
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
    const requiredSlot = SLOT_MAPPING[id as keyof typeof SLOT_MAPPING]
    return item.slot === requiredSlot
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

function DraggableItem({ item }: { item: Item }) {
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
    switch (item.slot) {
      case 2: return EQUIPMENT_ICONS.Head
      case 3: return EQUIPMENT_ICONS.Face
      case 4: return EQUIPMENT_ICONS.Ear1
      case 5: return EQUIPMENT_ICONS.Neck
      case 6: return EQUIPMENT_ICONS.Chest
      // Add more cases as needed
      default: return null
    }
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