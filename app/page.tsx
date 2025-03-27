"use client"

import { useState, useRef } from "react"
import { ArrowRight, Download, Trash2, Undo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import DrawingCanvas from "@/components/drawing-canvas"
import ToolsPanel from "@/components/tools-panel"

export default function PainTool() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [view, setView] = useState<"front" | "back">("front")
  const [selectedTool, setSelectedTool] = useState("pencil")
  const [selectedColor, setSelectedColor] = useState("#ff0000")
  const [canvasHistory, setCanvasHistory] = useState<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1)
    }
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setCanvasHistory([...canvasHistory, canvas.toDataURL()])
        setCurrentHistoryIndex(canvasHistory.length)
      }
    }
  }

  const handleSwitchView = () => {
    setView(view === "front" ? "back" : "front")
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `pain-diagram-${gender}-${view}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Pain Tool</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-blue-50 hover:bg-blue-100" onClick={handleUndo}>
            <Undo className="h-5 w-5 mr-1" />
            Undo
          </Button>
          <Button variant="outline" className="bg-red-50 hover:bg-red-100" onClick={handleClear}>
            <Trash2 className="h-5 w-5 mr-1" />
            Clear
          </Button>
          <Button variant="outline" className="bg-blue-50 hover:bg-blue-100" onClick={handleSwitchView}>
            <ArrowRight className="h-5 w-5 mr-1" />
            Switch to {view === "front" ? "back" : "front"}
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={handleDownload}>
            <Download className="h-5 w-5 mr-1" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-auto">
          <div className="border rounded-lg p-4 mb-4">
            <ToggleGroup
              type="single"
              value={gender}
              onValueChange={(value) => value && setGender(value as "male" | "female")}
            >
              <ToggleGroupItem value="female" className="w-1/2">
                <span className="mr-2">♀</span> Female
              </ToggleGroupItem>
              <ToggleGroupItem value="male" className="w-1/2">
                <span className="mr-2">♂</span> Male
              </ToggleGroupItem>
            </ToggleGroup>

            <ToolsPanel
              selectedTool={selectedTool}
              setSelectedTool={setSelectedTool}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />
          </div>
        </div>

        <div className="flex-1 border rounded-lg overflow-hidden">
          <div className="bg-blue-500 text-white py-2 px-4 rounded-t-lg">
            <Button variant="ghost" className="text-white hover:bg-blue-600 font-medium text-lg">
              {view === "front" ? "Front" : "Back"}
            </Button>
          </div>
          <div className="p-4 flex justify-center">
            <DrawingCanvas
              ref={canvasRef}
              gender={gender}
              view={view}
              selectedTool={selectedTool}
              selectedColor={selectedColor}
              canvasHistory={canvasHistory}
              setCanvasHistory={setCanvasHistory}
              currentHistoryIndex={currentHistoryIndex}
              setCurrentHistoryIndex={setCurrentHistoryIndex}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

