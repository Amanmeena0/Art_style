import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="text-center mb-xl relative pt-lg">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 organic-shape-1 -z-10 blur-xl"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary/5 organic-shape-1 -z-10 blur-xl"></div>
      <h1 className="font-headline-lg text-headline-lg text-primary mb-md">Blend Your Vision</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-lg">
        Harmonize two distinct images into a single botanical masterpiece. Crafted for intentional creators who seek tranquility in digital craft.
      </p>
      <Link 
        to="/studio" 
        className="inline-flex items-center gap-sm px-xl py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-all active:scale-95 shadow-lg shadow-primary/10"
      >
        <span className="material-symbols-outlined">filter_vintage</span>
        Enter the Studio
      </Link>
    </section>
  );
}
