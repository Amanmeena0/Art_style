import { Navbar } from "@/components/UiView"
import Grid from "@/components/mainGrid";
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'


function App() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-end gap-4 p-4">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        
        <Show when="signed-in">
          <UserButton />
        </Show>
      </header>
      <Navbar />
      <div className="flex flex-1 overflow-hidden relative w-full">
        <Grid/>
      </div>
    </div>
  )
}

export default App

