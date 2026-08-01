import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Component Library</h1>
        <p className="mt-2 text-muted-foreground">
          Development playground
        </p>
      </div>

      <div className="flex gap-3">
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </main>
  )
}

export default App