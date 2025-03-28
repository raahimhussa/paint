"use client"

import type React from "react"

import { forwardRef, useEffect, useRef, useState } from "react"

import { images } from "@/lib/images"

interface DrawingCanvasProps {
  gender: "male" | "female"
  view: "front" | "back"
  selectedTool: string
  selectedColor: string
  canvasHistory: string[]
  setCanvasHistory: (history: string[]) => void
  currentHistoryIndex: number
  setCurrentHistoryIndex: (index: number) => void
}

const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(function DrawingCanvas(
  {
    gender,
    view,
    selectedTool,
    selectedColor,
    canvasHistory,
    setCanvasHistory,
    currentHistoryIndex,
    setCurrentHistoryIndex,
  },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const bodyImageRef = useRef<HTMLImageElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Set the forwarded ref to our internal ref
  useEffect(() => {
    if (typeof ref === "function") {
      ref(canvasRef.current)
    } else if (ref) {
      ref.current = canvasRef.current
    }
  }, [ref])

  // Load the appropriate body image based on gender and view
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set default canvas size
    canvas.width = 400
    canvas.height = 600

    // Reset states
    setImageLoaded(false)
    setImageError(false)

    // Determine which image to load
    let imageSrc = ""
    if (gender === "male") {
      imageSrc = view === "front" ? images.MaleFront : images.MaleBack
    } else {
      imageSrc = view === "front" ? images.FemaleFront : images.FemaleBack
    }

    // Load the image
    const img = new Image()
    img.crossOrigin = "anonymous" // Important for CORS
    img.src = imageSrc

    img.onload = () => {
      // Adjust canvas size to match image aspect ratio
      const aspectRatio = img.width / img.height
      canvas.height = canvas.width / aspectRatio

      // Draw the body image
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      bodyImageRef.current = img
      setImageLoaded(true)

      // Initialize history if empty
      if (canvasHistory.length === 0) {
        const initialState = canvas.toDataURL()
        setCanvasHistory([initialState])
        setCurrentHistoryIndex(0)
      }
    }

    img.onerror = () => {
      console.error("Failed to load body image")
      setImageError(true)

      // Draw a fallback outline
      drawBodyOutline(ctx, gender, view)

      // Initialize history if empty
      if (canvasHistory.length === 0) {
        const initialState = canvas.toDataURL()
        setCanvasHistory([initialState])
        setCurrentHistoryIndex(0)
      }
    }
  }, [gender, view, canvasHistory.length, setCanvasHistory, setCurrentHistoryIndex])

  // Add this function to draw the body outline as fallback
  const drawBodyOutline = (ctx: CanvasRenderingContext2D, gender: string, view: string) => {
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
    ctx.fillStyle = "#fff"

    // Head
    ctx.beginPath()
    ctx.arc(200, 70, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    if (view === "front") {
      // Front view body

      // Neck
      ctx.beginPath()
      ctx.moveTo(180, 100)
      ctx.lineTo(180, 120)
      ctx.moveTo(220, 100)
      ctx.lineTo(220, 120)
      ctx.stroke()

      // Shoulders
      ctx.beginPath()
      ctx.moveTo(180, 120)
      ctx.lineTo(140, 150)
      ctx.moveTo(220, 120)
      ctx.lineTo(260, 150)
      ctx.stroke()

      // Torso
      ctx.beginPath()
      ctx.moveTo(180, 120)
      ctx.lineTo(170, 280)
      ctx.lineTo(230, 280)
      ctx.lineTo(220, 120)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Arms
      ctx.beginPath()
      ctx.moveTo(140, 150)
      ctx.lineTo(120, 250)
      ctx.lineTo(110, 320)
      ctx.moveTo(260, 150)
      ctx.lineTo(280, 250)
      ctx.lineTo(290, 320)
      ctx.stroke()

      // Legs
      ctx.beginPath()
      ctx.moveTo(170, 280)
      ctx.lineTo(160, 450)
      ctx.lineTo(150, 550)
      ctx.moveTo(230, 280)
      ctx.lineTo(240, 450)
      ctx.lineTo(250, 550)
      ctx.stroke()

      // Face details (simple)
      ctx.beginPath()
      ctx.arc(185, 60, 5, 0, Math.PI * 2) // Left eye
      ctx.arc(215, 60, 5, 0, Math.PI * 2) // Right eye
      ctx.moveTo(185, 80)
      ctx.lineTo(215, 80) // Mouth
      ctx.stroke()
    } else {
      // Back view body

      // Neck
      ctx.beginPath()
      ctx.moveTo(190, 100)
      ctx.lineTo(190, 120)
      ctx.moveTo(210, 100)
      ctx.lineTo(210, 120)
      ctx.stroke()

      // Shoulders
      ctx.beginPath()
      ctx.moveTo(190, 120)
      ctx.lineTo(140, 150)
      ctx.moveTo(210, 120)
      ctx.lineTo(260, 150)
      ctx.stroke()

      // Torso
      ctx.beginPath()
      ctx.moveTo(190, 120)
      ctx.lineTo(180, 280)
      ctx.lineTo(220, 280)
      ctx.lineTo(210, 120)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Arms
      ctx.beginPath()
      ctx.moveTo(140, 150)
      ctx.lineTo(120, 250)
      ctx.lineTo(110, 320)
      ctx.moveTo(260, 150)
      ctx.lineTo(280, 250)
      ctx.lineTo(290, 320)
      ctx.stroke()

      // Legs
      ctx.beginPath()
      ctx.moveTo(180, 280)
      ctx.lineTo(170, 450)
      ctx.lineTo(160, 550)
      ctx.moveTo(220, 280)
      ctx.lineTo(230, 450)
      ctx.lineTo(240, 550)
      ctx.stroke()
    }

    // Store the body outline as the background image
    bodyImageRef.current = new Image()
    bodyImageRef.current.src = canvasRef.current?.toDataURL() || ""
  }

  // Apply history state when currentHistoryIndex changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (currentHistoryIndex >= 0 && canvasHistory[currentHistoryIndex]) {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const img = new Image()
      img.src = canvasHistory[currentHistoryIndex]
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    }
  }, [currentHistoryIndex, canvasHistory])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate the scaled coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    setIsDrawing(true)
    setStartX(x)
    setStartY(y)
    setLastX(x)
    setLastY(y)

    if (selectedTool === "pencil" || selectedTool === "eraser") {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y)
      ctx.strokeStyle = selectedTool === "eraser" ? "#ffffff" : selectedColor
      ctx.lineWidth = selectedTool === "eraser" ? 20 : 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    if ("touches" in e) {
      // Touch event
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
      e.preventDefault() // Prevent scrolling on touch devices
    } else {
      // Mouse event
      clientX = e.clientX
      clientY = e.clientY
    }

    // Calculate the scaled coordinates
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    if (selectedTool === "pencil" || selectedTool === "eraser") {
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = selectedTool === "eraser" ? "#ffffff" : selectedColor
      ctx.lineWidth = selectedTool === "eraser" ? 20 : 3
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.stroke()
    } else {
      // For shape tools, redraw the canvas and then draw the shape
      if (bodyImageRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Redraw the current history state
        if (currentHistoryIndex >= 0 && canvasHistory[currentHistoryIndex]) {
          const img = new Image()
          img.src = canvasHistory[currentHistoryIndex]
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        } else {
          // Fallback to just drawing the body outline
          if (bodyImageRef.current) {
            ctx.drawImage(bodyImageRef.current, 0, 0, canvas.width, canvas.height)
          } else {
            drawBodyOutline(ctx, gender, view)
          }
        }

        // Rest of the drawing code...
        ctx.strokeStyle = selectedColor
        ctx.lineWidth = 3
        ctx.beginPath()

        if (selectedTool === "circle") {
          const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2))
          ctx.arc(startX, startY, radius, 0, 2 * Math.PI)
        } else if (selectedTool === "square") {
          const width = x - startX
          const height = y - startY
          ctx.rect(startX, startY, width, height)
        } else if (selectedTool === "triangle") {
          ctx.moveTo(startX, startY)
          ctx.lineTo(x, y)
          ctx.lineTo(startX - (x - startX), y)
          ctx.closePath()
        } else if (selectedTool === "arrow") {
          // Draw line
          ctx.moveTo(startX, startY)
          ctx.lineTo(x, y)

          // Calculate arrow head
          const angle = Math.atan2(y - startY, x - startX)
          const headLength = 15

          ctx.lineTo(x - headLength * Math.cos(angle - Math.PI / 6), y - headLength * Math.sin(angle - Math.PI / 6))
          ctx.moveTo(x, y)
          ctx.lineTo(x - headLength * Math.cos(angle + Math.PI / 6), y - headLength * Math.sin(angle + Math.PI / 6))
        }

        ctx.stroke()
      }
    }

    setLastX(x)
    setLastY(y)
  }

  const endDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    const canvas = canvasRef.current
    if (!canvas) return

    // Save the current state to history
    const newState = canvas.toDataURL()
    const newHistory = canvasHistory.slice(0, currentHistoryIndex + 1)
    setCanvasHistory([...newHistory, newState])
    setCurrentHistoryIndex(newHistory.length)

    // For text tool, prompt for text input
    if (selectedTool === "text") {
      const text = prompt("Enter text:")
      if (text && text.trim() !== "") {
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.font = "16px Arial"
        ctx.fillStyle = selectedColor
        ctx.fillText(text, startX, startY)

        // Save the updated state with text
        const updatedState = canvas.toDataURL()
        setCanvasHistory([...newHistory, newState, updatedState])
        setCurrentHistoryIndex(newHistory.length + 1)
      }
    }
  }

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        className="border rounded max-w-full h-auto"
        style={{ maxHeight: "70vh" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      {imageError && (
        <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm">
          Using fallback body outline
        </div>
      )}
    </div>
  )
})

export default DrawingCanvas

