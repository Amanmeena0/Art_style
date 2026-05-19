import { Navbar, Footer } from "@/components/UiView";
import { Hero } from "@/components/Hero";
import { Gallery } from "@/components/Gallery";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-container-max mx-auto px-gutter py-xl flex-1">
        <Hero />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}
