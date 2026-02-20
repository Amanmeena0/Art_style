import { Navbar } from "@/components/UiView"
import { SideBar } from "@/components/sidebar";
import Grid from "@/components/mainGrid";
import { useState } from "react";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col">
     <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
     <div className="flex flex-1 overflow-hidden relative">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Grid/>
     </div>
    </div>
  )
}

export default App

