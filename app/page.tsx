"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import XMLInput from "@/components/xml-input"
import ConversionOptionsComponent from "@/components/conversion-options"
import JSONOutput from "@/components/json-output"
import ActionButtons from "@/components/action-buttons"

interface ConversionOptions {
  includeAttributes: boolean
  arrayMode: "auto" | "always" | "never"
  textNodeName: string
  attributePrefix: string
  ignoreWhitespace: boolean
}

export default function XMLToJSONConverter() {
  const [xmlContent, setXmlContent] = useState("")
  const [jsonOutput, setJsonOutput] = useState("")
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [options, setOptions] = useState<ConversionOptions>({
    includeAttributes: true,
    arrayMode: "auto",
    textNodeName: "_text",
    attributePrefix: "@",
    ignoreWhitespace: true,
  })

  const xmlToJson = (xmlNode: Element | Document, opts: ConversionOptions): any => {
    const result: any = {}

    if (xmlNode.nodeType === Node.DOCUMENT_NODE) {
      const docElement = (xmlNode as Document).documentElement
      return { [docElement.tagName]: xmlToJson(docElement, opts) }
    }

    const element = xmlNode as Element

    // Handle attributes
    if (opts.includeAttributes && element.attributes && element.attributes.length > 0) {
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        result[opts.attributePrefix + attr.name] = attr.value
      }
    }

    // Handle child nodes
    const children: any = {}
    const textContent: string[] = []

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i]

      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim() || ""
        if (!opts.ignoreWhitespace || text) {
          textContent.push(text)
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const childElement = child as Element
        const childName = childElement.tagName
        const childValue = xmlToJson(childElement, opts)

        if (children[childName]) {
          // Convert to array if multiple elements with same name
          if (!Array.isArray(children[childName])) {
            children[childName] = [children[childName]]
          }
          children[childName].push(childValue)
        } else {
          if (opts.arrayMode === "always") {
            children[childName] = [childValue]
          } else {
            children[childName] = childValue
          }
        }
      }
    }

    // Handle text content
    if (textContent.length > 0) {
      const text = textContent.join(" ").trim()
      if (text) {
        if (Object.keys(children).length > 0) {
          result[opts.textNodeName] = text
        } else {
          // If only text content, return the text directly
          return Object.keys(result).length > 0 ? { ...result, [opts.textNodeName]: text } : text
        }
      }
    }

    // Merge children into result
    Object.assign(result, children)

    return Object.keys(result).length === 0 ? null : result
  }

  const transformXML = async () => {
    if (!xmlContent.trim()) {
      setError("Veuillez d'abord télécharger un fichier XML")
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      // Parse XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml")

      // Check for XML parsing errors
      const parseError = xmlDoc.querySelector("parsererror")
      if (parseError) {
        throw new Error("Format XML invalide : " + parseError.textContent)
      }

      // Convert XML to JSON
      const jsonResult = xmlToJson(xmlDoc, options)

      // Format JSON output
      const formattedJson = JSON.stringify(jsonResult, null, 2)
      setJsonOutput(formattedJson)
    } catch (err) {
      setError(`Erreur de conversion : ${err instanceof Error ? err.message : "Erreur inconnue"}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetAll = () => {
    setXmlContent("")
    setJsonOutput("")
    setError("")
  }

  const loadSample = () => {
    setXmlContent(sampleXML)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Convertisseur XML vers JSON</h1>
          <p className="text-gray-600">Outil simple pour transformer XML en JSON</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <XMLInput xmlContent={xmlContent} setXmlContent={setXmlContent} loadSample={loadSample} />
            </div>
            <div>
              <ConversionOptionsComponent options={options} setOptions={setOptions} />
            </div>
          </div>

          <ActionButtons
            onTransform={transformXML}
            onReset={resetAll}
            isProcessing={isProcessing}
            hasOutput={!!jsonOutput}
            jsonOutput={jsonOutput}
          />
        </Card>

        {jsonOutput && <JSONOutput jsonOutput={jsonOutput} />}
      </div>
    </div>
  )
}

const sampleXML = `<?xml version="1.0" encoding="UTF-8"?>
<librairie>
  <livre id="1" categorie="fiction">
    <titre lang="fr">Le Grand Gatsby</titre>
    <auteur>F. Scott Fitzgerald</auteur>
    <annee>1925</annee>
    <prix devise="EUR">12.99</prix>
  </livre>
  <livre id="2" categorie="science">
    <titre lang="fr">Une brève histoire du temps</titre>
    <auteur>Stephen Hawking</auteur>
    <annee>1988</annee>
    <prix devise="EUR">15.99</prix>
  </livre>
</librairie>`
