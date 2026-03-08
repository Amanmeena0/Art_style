import { Navbar } from "@/components/UiView"
import Grid from "@/components/mainGrid";


function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
     <Navbar />
     <div className="flex flex-1 overflow-hidden relative w-full">
      <Grid/>
     </div>
    </div>
  )
}

export default App

