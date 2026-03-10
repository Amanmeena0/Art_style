import { Navbar } from "@/components/UiView"
import Grid from "@/components/mainGrid";
import { ClerkLoading, ClerkLoaded, Show, SignIn, UserButton } from '@clerk/react'


function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <ClerkLoading>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <Show when="signed-out">
          <div className="flex items-center justify-center h-full">
            <SignIn />
          </div>
        </Show>
        
        <Show when="signed-in">
          <header className="flex items-center justify-end gap-4 p-4">
            <UserButton />
          </header>
          <Navbar />
          <div className="flex flex-1 overflow-hidden relative w-full">
            <Grid/>
          </div>
        </Show>
      </ClerkLoaded>
    </div>
  )
}

export default App    

