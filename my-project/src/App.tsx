import { Navbar } from "@/components/UiView"
import { SideBar } from "@/components/sidebar";
import Grid from "@/components/mainGrid";


function App() {
 

  return (
    <>
     <Navbar/>
     <div className="flex">
      <SideBar/>
      <Grid/>
     </div>
    </>
  )
}

export default App

