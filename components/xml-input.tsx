"use client"

import type { ChangeEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface XMLInputProps {
  xmlContent: string
  setXmlContent: (content: string) => void
  loadSample: () => void
}

export default function XMLInput({ xmlContent, setXmlContent, loadSample }: XMLInputProps) {
  const handleXMLUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if ((file && file.type === "text/xml") || file?.name.endsWith(".xml")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setXmlContent(e.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Entrée XML
        </h2>
        <Button variant="outline" size="sm" onClick={loadSample}>
          Charger l'exemple
        </Button>
      </div>

      <div>
        <Label htmlFor="xml-upload" className="block mb-2">
          Télécharger un fichier XML
        </Label>
        <input
          id="xml-upload"
          type="file"
          accept=".xml,text/xml"
          onChange={handleXMLUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />
      </div>

      <div>
        <Label htmlFor="xml-content" className="block mb-2">
          Ou coller le contenu XML
        </Label>
        <Textarea
          id="xml-content"
          placeholder="Collez votre contenu XML ici..."
          value={xmlContent}
          onChange={(e) => setXmlContent(e.target.value)}
          className="min-h-[250px] font-mono text-sm"
        />
      </div>
    </div>
  )
}
