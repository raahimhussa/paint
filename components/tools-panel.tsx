"use client"

import { Pencil, Circle, Square, Triangle, ArrowRight, Type, Eraser } from "lucide-react"

interface ToolsPanelProps {
  selectedTool: string
  setSelectedTool: (tool: string) => void
  selectedColor: string
  setSelectedColor: (color: string) => void
}

const tools = [
  { id: "pencil", icon: <Pencil className="h-5 w-5" />, label: "Pencil" },
  { id: "circle", icon: <Circle className="h-5 w-5" />, label: "Circle" },
  { id: "square", icon: <Square className="h-5 w-5" />, label: "Square" },
  { id: "triangle", icon: <Triangle className="h-5 w-5" />, label: "Triangle" },
  { id: "arrow", icon: <ArrowRight className="h-5 w-5" />, label: "Arrows" },
  { id: "text", icon: <Type className="h-5 w-5" />, label: "Text" },
  { id: "eraser", icon: <Eraser className="h-5 w-5" />, label: "Eraser" },
]

const colors = [
  "#ff0000", // red
  "#0000ff", // blue
  "#666666", // gray
  "#9c27b0", // purple
  "#2196f3", // light blue
  "#ffeb3b", // yellow
  "#e91e63", // pink
  "#4caf50", // green
  "#009688", // teal
  "#00bcd4", // cyan
]

export default function ToolsPanel({
  selectedTool,
  setSelectedTool,
  selectedColor,
  setSelectedColor,
}: ToolsPanelProps) {
  return (
    <div>
      <h3 className="font-medium mt-4 mb-2">Tools</h3>
      <div className="space-y-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
              selectedTool === tool.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => setSelectedTool(tool.id)}
          >
            <span className="mr-2">{tool.icon}</span>
            {tool.label}
          </button>
        ))}
      </div>

      <h3 className="font-medium mt-6 mb-2">Colors</h3>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColor === color ? "border-gray-800" : "border-transparent"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  )
}

