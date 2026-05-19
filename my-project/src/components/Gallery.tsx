export function Gallery() {
  return (
    <section className="mt-xl">
      <h2 className="font-headline-md text-headline-md text-primary mb-lg text-center">Inspired by the Studio</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="md:col-span-2 relative h-80 rounded-xl overflow-hidden group shadow-md border border-outline-variant/10">
          <img 
            alt="Botanical Merge Example 1" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuABaoQc3hXvh0WcDqRWTyg35yr0CeROPTBuImVqEEY3g7FvvPY9dI5CoQ6nDJV3rKpec4Q1fPQztN8yg_fjGWjz4i06MbbxcQU3vp36kpB61frziorpa-JssvVkOVuH_38BiIJPJe-29Wgm-3bJWiCs72XRuRRTuHBREd74YIrIBMIrfx4FUfonLEv_DviVPiq1i1rGbw3LGBzXeJZdqMxNoXOm6qDIt0lC6ZOQV8ANhCTG9pgg_m-JrlvpMRPRi-A61g26HbnZybg"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent flex flex-col justify-end p-md">
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest">Technique: Vellum Overlap</span>
            <h3 className="font-headline-sm text-headline-sm text-white">Floral Transparency</h3>
          </div>
        </div>
        <div className="relative h-80 rounded-xl overflow-hidden group shadow-md border border-outline-variant/10">
          <img 
            alt="Botanical Merge Example 2" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7kxTjJmZUDPiXMNgHDteqb7Xc7LjVwiq8HimqSLwaa50_jH4ZaL5QddzSb-zKjFVkTuZBBoe2MtRjhi8Ov_m_CizuA-sqVklILdniozm60MFCN22Ph5fW-dlQA_NU2ht0ZTL2qcXDlx4CqqhbTK38dxqyMAXZRy55E6W-77CRViSvI6w7ME6sSpVNZlyVn98F3LiHHGditaqvEzrqn8rLB5K7AoCQQAHEMhbPo6PREVCeF9sKbNpNHAPFqLCoCwARuTYS5AaXbUE"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/60 to-transparent flex flex-col justify-end p-md">
            <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-widest">Technique: Grain Mask</span>
            <h3 className="font-headline-sm text-headline-sm text-white">Wooden Ferns</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
