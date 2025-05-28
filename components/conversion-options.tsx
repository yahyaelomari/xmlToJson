"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ConversionOptionsProps {
  options: {
    includeAttributes: boolean
    arrayMode: "auto" | "always" | "never"
    textNodeName: string
    attributePrefix: string
    ignoreWhitespace: boolean
  }
  setOptions: (options: any) => void
}

export default function ConversionOptions({ options, setOptions }: ConversionOptionsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <Settings className="h-5 w-5 text-blue-600" />
        Options
      </h2>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-attributes"
            checked={options.includeAttributes}
            onCheckedChange={(checked) => setOptions({ ...options, includeAttributes: checked as boolean })}
          />
          <Label htmlFor="include-attributes" className="text-sm">
            Inclure les attributs XML
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ignore-whitespace"
            checked={options.ignoreWhitespace}
            onCheckedChange={(checked) => setOptions({ ...options, ignoreWhitespace: checked as boolean })}
          />
          <Label htmlFor="ignore-whitespace" className="text-sm">
            Ignorer les espaces
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="array-mode" className="text-sm">
            Gestion des tableaux
          </Label>
          <Select
            value={options.arrayMode}
            onValueChange={(value: "auto" | "always" | "never") => setOptions({ ...options, arrayMode: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (tableaux pour doublons)</SelectItem>
              <SelectItem value="always">Toujours utiliser des tableaux</SelectItem>
              <SelectItem value="never">Jamais de tableaux</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center justify-between w-full p-0 h-8">
              <span className="text-sm font-medium">Options avancées</span>
              <ChevronDown
                className="h-4 w-4 transition-transform"
                style={{ transform: isOpen ? "rotate(180deg)" : "" }}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="attribute-prefix" className="text-sm">
                Préfixe des attributs
              </Label>
              <input
                id="attribute-prefix"
                type="text"
                value={options.attributePrefix}
                onChange={(e) => setOptions({ ...options, attributePrefix: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="@"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-node-name" className="text-sm">
                Nom du nœud texte
              </Label>
              <input
                id="text-node-name"
                type="text"
                value={options.textNodeName}
                onChange={(e) => setOptions({ ...options, textNodeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="_text"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
