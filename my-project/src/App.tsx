import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import StudioPage from "@/pages/StudioPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route 
          path="/signin" 
          element={
            <>
              <SignedIn>
                <Navigate to="/studio" replace />
              </SignedIn>
              <SignedOut>
                <SignInPage />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <>
              <SignedIn>
                <Navigate to="/studio" replace />
              </SignedIn>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
            </>
          } 
        />

        {/* Protected Routes */}
        <Route 
          path="/studio" 
          element={
            <>
              <SignedIn>
                <StudioPage />
              </SignedIn>
              <SignedOut>
                <Navigate to="/signin" replace />
              </SignedOut>
            </>
          } 
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
