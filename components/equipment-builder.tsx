'use client'

import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import { useState } from "react"

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
    { id: "Arms2", col: 2 },
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

const CHARACTER_CLASSES = [
  "Magician", "Bard", "Beastlord", "Berserker", "Cleric", 
  "Druid", "Enchanter", "Monk", "Necromancer", "Paladin", 
  "Ranger", "Rogue", "Shadow Knight", "Shaman", "Warrior", "Wizard"
]

export function EquipmentBuilder() {
  const [equipped, setEquipped] = useState<Record<string, any>>({})
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["Magician"])
  const [isClassesOpen, setIsClassesOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [baseStats, setBaseStats] = useState({
    health: { hp: 49, mp: 23, en: 18 },
    combat: { ac: 28, mit: 2, avd: 15, atk: 14, dmg: 10, heal: 5 },
    attributes: { str: 55, sta: 65, agi: 71, dex: 70, wis: 107, int: 115, cha: 115 },
    resistances: { poison: 10, magic: 15, disease: 8, fire: 12, cold: 12 }
  })
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return
    setEquipped((prev) => ({ ...prev, [over.id]: active.id }))
  }

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
                    <p className="text-lg font-medium">HP: {baseStats.health.hp}/{baseStats.health.hp}</p>
                    <p className="text-lg font-medium">MP: {baseStats.health.mp}/{baseStats.health.mp}</p>
                    <p className="text-lg font-medium">EN: {baseStats.health.en}/{baseStats.health.en}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Combat</p>
                    <p className="text-lg font-medium">AC: {baseStats.combat.ac}</p>
                    <p className="text-lg font-medium">MIT: {baseStats.combat.mit}</p>
                    <p className="text-lg font-medium">AVD: {baseStats.combat.avd}</p>
                    <p className="text-lg font-medium">ATK: {baseStats.combat.atk}</p>
                    <p className="text-lg font-medium">DMG: {baseStats.combat.dmg}</p>
                    <p className="text-lg font-medium">HEAL: {baseStats.combat.heal}</p>
                  </div>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex gap-8">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Attributes</p>
                    <p className="text-lg font-medium">STR: {baseStats.attributes.str}</p>
                    <p className="text-lg font-medium">STA: {baseStats.attributes.sta}</p>
                    <p className="text-lg font-medium">AGI: {baseStats.attributes.agi}</p>
                    <p className="text-lg font-medium">DEX: {baseStats.attributes.dex}</p>
                    <p className="text-lg font-medium">WIS: {baseStats.attributes.wis}</p>
                    <p className="text-lg font-medium">INT: {baseStats.attributes.int}</p>
                    <p className="text-lg font-medium">CHA: {baseStats.attributes.cha}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Resistances</p>
                    <p className="text-lg font-medium">POISON: {baseStats.resistances.poison}</p>
                    <p className="text-lg font-medium">MAGIC: {baseStats.resistances.magic}</p>
                    <p className="text-lg font-medium">DISEASE: {baseStats.resistances.disease}</p>
                    <p className="text-lg font-medium">FIRE: {baseStats.resistances.fire}</p>
                    <p className="text-lg font-medium">COLD: {baseStats.resistances.cold}</p>
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
                        {Object.entries(baseStats.health).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBaseStats(prev => ({
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
                        {Object.entries(baseStats.combat).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBaseStats(prev => ({
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
                        {Object.entries(baseStats.attributes).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBaseStats(prev => ({
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
                        {Object.entries(baseStats.resistances).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <label className="uppercase text-sm font-medium">{key}:</label>
                            <input
                              type="number"
                              value={value}
                              onChange={(e) => setBaseStats(prev => ({
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
                  <EquipmentSlot key={slot.id} id={slot.id} equippedItem={equipped[slot.id]} />
                ))}
                
                {/* Row 2 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row2[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row2[0].id]} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row2[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row2[1].id]} />
                
                {/* Row 3 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row3[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row3[0].id]} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row3[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row3[1].id]} />
                
                {/* Row 4 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row4[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row4[0].id]} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row4[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row4[1].id]} />
                
                {/* Row 5 */}
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row5[0].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row5[0].id]} />
                <div className="w-16 h-16 bg-transparent" />
                <div className="w-16 h-16 bg-transparent" />
                <EquipmentSlot id={EQUIPMENT_LAYOUT.row5[1].id} equippedItem={equipped[EQUIPMENT_LAYOUT.row5[1].id]} />
                
                {/* Row 6 */}
                {EQUIPMENT_LAYOUT.row6.map((slot) => (
                  <EquipmentSlot key={slot.id} id={slot.id} equippedItem={equipped[slot.id]} />
                ))}
                
                {/* Row 7 */}
                <div className="w-16 h-16 bg-transparent" />
                {EQUIPMENT_LAYOUT.row7.map((slot) => (
                  <EquipmentSlot key={slot.id} id={slot.id} equippedItem={equipped[slot.id]} />
                ))}
                
                {/* Row 8 */}
                {EQUIPMENT_LAYOUT.row8.map((slot) => (
                  <EquipmentSlot key={slot.id} id={slot.id} equippedItem={equipped[slot.id]} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card text-card-foreground p-4 rounded-lg border w-[300px]">
          <h2 className="text-center text-lg font-bold border-b pb-2">Available Items</h2>
          <div className="grid grid-cols-3 gap-[2px] mt-4">
          </div>
        </div>
      </DndContext>
    </div>
  )
}

function EquipmentSlot({ id, equippedItem }: { id: string; equippedItem?: any }) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`w-16 h-16 flex items-center justify-center text-xs text-center ${
        isOver 
          ? "bg-primary/20" 
          : "bg-card"
      }`}
    >
      {equippedItem ? (
        <span className="text-xs break-words">{equippedItem}</span>
      ) : (
        <span className="text-muted-foreground">{id}</span>
      )}
    </div>
  )
}

function DraggableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
  })
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-full aspect-square flex items-center justify-center p-1 cursor-move
        ${isDragging ? "bg-primary/20" : "bg-card"}
      `}
    >
      <span className="text-xs text-center break-words">{id}</span>
    </div>
  )
} 