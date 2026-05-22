import { UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Navbar, Footer } from "@/components/UiView";

export default function DashboardPage() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col">
      <Navbar />
      
      <main className="max-w-container-max mx-auto px-gutter py-xl flex-1 w-full">
        <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/20 shadow-sm animate-fadeIn">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="font-headline-md text-headline-md text-primary mb-2">
                Welcome back, {user?.firstName || "Creator"}!
              </h1>
              <p className="font-body-lg text-on-surface-variant">
                Manage your intentional creations and explore your studio.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-surface rounded-2xl p-4 border border-outline-variant/10">
               <UserButton afterSignOutUrl="/" />
               <div className="hidden sm:block">
                  <p className="font-label-md text-label-md text-on-surface">{user?.fullName}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{user?.primaryEmailAddress?.emailAddress}</p>
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Action Card */}
            <Link 
              to="/studio" 
              className="group bg-surface hover:bg-primary/5 border border-outline-variant/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary">palette</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-2">Your Studio</h3>
              <p className="font-body-md text-on-surface-variant">
                Access your botanical creation tools and start a new project.
              </p>
            </Link>

            {/* Placeholder Card 2 */}
            <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-secondary">grid_view</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-2">Gallery</h3>
              <p className="font-body-md text-on-surface-variant">
                Browse through your saved creations (Coming Soon).
              </p>
            </div>

            {/* Placeholder Card 3 */}
            <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 opacity-60">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-tertiary">settings</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface mb-2">Settings</h3>
              <p className="font-body-md text-on-surface-variant">
                Configure your account preferences and studio defaults.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
