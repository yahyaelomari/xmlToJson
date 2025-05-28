import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

interface JSONOutputProps {
  jsonOutput: string
}

export default function JSONOutput({ jsonOutput }: JSONOutputProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          Sortie JSON
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="formatted" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="formatted">Formaté</TabsTrigger>
            <TabsTrigger value="minified">Minifié</TabsTrigger>
          </TabsList>
          <TabsContent value="formatted">
            <Textarea value={jsonOutput} readOnly className="min-h-[300px] font-mono text-sm" />
          </TabsContent>
          <TabsContent value="minified">
            <Textarea
              value={JSON.stringify(JSON.parse(jsonOutput))}
              readOnly
              className="min-h-[300px] font-mono text-sm"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
