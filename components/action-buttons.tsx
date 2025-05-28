"use client"

import { Button } from "@/components/ui/button"
import { Download, Code } from "lucide-react"

interface ActionButtonsProps {
  onTransform: () => void
  onReset: () => void
  isProcessing: boolean
  hasOutput: boolean
  jsonOutput: string
}

export default function ActionButtons({
  onTransform,
  onReset,
  isProcessing,
  hasOutput,
  jsonOutput,
}: ActionButtonsProps) {
  const downloadJSON = () => {
    if (!jsonOutput) return

    const blob = new Blob([jsonOutput], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "converti.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (jsonOutput) {
      await navigator.clipboard.writeText(jsonOutput)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center mt-6">
      <Button onClick={onTransform} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
        {isProcessing ? "Conversion en cours..." : "Convertir en JSON"}
      </Button>

      <Button variant="outline" onClick={onReset}>
        Réinitialiser
      </Button>

      {hasOutput && (
        <>
          <Button onClick={downloadJSON} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>

          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Code className="h-4 w-4 mr-2" />
            Copier
          </Button>
        </>
      )}
    </div>
  )
}
