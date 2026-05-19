import { Link } from "react-router-dom";
import * as Clerk from "@clerk/clerk-react";

export function Navbar() {
  return (
    <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 shadow-sm shadow-secondary/5 docked full-width top-0 sticky z-50">
      <div className="flex justify-between items-center w-full px-gutter h-28 max-w-container-max mx-auto">
        <Link to="/" className="font-headline-lg text-headline-lg text-primary tracking-tighter hover:scale-105 transition-transform duration-300 block py-2">
          Botanical Merge
        </Link>
          <nav className="hidden md:flex items-center gap-lg">
            <Link to="/studio" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300">Studio</Link>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Gallery</a>
            <a className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300" href="#">Resources</a>
          </nav>
        
        <div className="flex items-center gap-md">
          <Clerk.SignedOut>
            <Link to="/signin" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-300 px-md py-sm">
              Sign In
            </Link>
            <Link to="/signup" className="px-md py-sm bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10">
              Sign Up
            </Link>
          </Clerk.SignedOut>
          <Clerk.SignedIn>
            <Clerk.UserButton afterSignOutUrl="/" />
          </Clerk.SignedIn>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/20 full-width mt-xl">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-gutter py-lg max-w-container-max mx-auto gap-base">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <Link to="/" className="font-headline-sm text-headline-sm text-primary font-bold">Botanical Merge</Link>
          <p className="font-label-sm text-label-sm text-on-surface-variant">© 2024 Botanical Merge Studio. Crafted for intentional creators.</p>
        </div>
        <nav className="flex gap-md">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors focus:ring-2 focus:ring-primary/20" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors focus:ring-2 focus:ring-primary/20" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-secondary transition-colors focus:ring-2 focus:ring-primary/20" href="#">Support</a>
        </nav>
      </div>
    </footer>
  );
}
