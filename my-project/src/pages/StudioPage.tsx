import { Navbar, Footer } from "@/components/UiView";
import Grid from "@/components/mainGrid";

export default function StudioPage() {
  return (
    <div className="bg-background text-on-surface grainy-bg min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-container-max mx-auto px-gutter py-xl flex-1">
        <Grid />
      </main>
      <Footer />
    </div>
  );
}
