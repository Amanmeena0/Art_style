import { Navbar } from "@/components/UiView"
import { SideBar } from "@/components/sidebar";
import Grid from "@/components/mainGrid";
import { useState } from "react";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
     <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
     <div className="flex flex-1 overflow-hidden relative w-full">
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Grid/>
     </div>
    </div>
  )
}

export default App

