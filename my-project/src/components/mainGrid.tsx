import React, { useState } from "react";
import type { ChangeEvent } from "react";

const Grid: React.FC = () => {
    const [photo1, setPhoto1] = useState<File | null>(null);
    const [preview1, setPreview1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<File | null>(null);
    const [preview2, setPreview2] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");
    const [mergedImage, setMergedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handlePhoto1Change = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage("Please select a valid image file");
            return;
        }
        setPhoto1(file);
        setPreview1(URL.createObjectURL(file));
        setMessage("");
    };

    const handlePhoto2Change = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setMessage("Please select a valid image file");
            return;
        }
        setPhoto2(file);
        setPreview2(URL.createObjectURL(file));
        setMessage("");
    };

    const handleMerge = async () => {
        if (!photo1 || !photo2) {
            setMessage("Please select both photos first");
            return;
        }

        try {
            setIsLoading(true);
            setMergedImage(null);
            setMessage("🔄 Uploading images...");
            
            const formData = new FormData();
            formData.append("style_image", photo1);
            formData.append("content_image", photo2);

            const uploadResponse = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json().catch(() => null);
                throw new Error(errorData?.detail || "Failed to upload images");
            }

            const { session_id } = await uploadResponse.json();

            setMessage("🔄 Processing style transfer...");
            const processForm = new FormData();
            processForm.append("session_id", session_id);

            const processResponse = await fetch("http://127.0.0.1:8000/process", {
                method: "POST",
                body: processForm,
            });

            if (!processResponse.ok) {
                const errorData = await processResponse.json().catch(() => null);
                throw new Error(errorData?.detail || "Style transfer failed");
            }

            const { result_base64 } = await processResponse.json();

            if (result_base64) {
                setMergedImage(`data:image/png;base64,${result_base64}`);
                setMessage("✅ Style transfer completed!");
            } else {
                setMessage("❌ No result image in response");
            }
        } catch (error) {
            setMessage(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (mergedImage) {
            const link = document.createElement("a");
            link.href = mergedImage;
            link.download = "botanical-merge-result.png";
            link.click();
        }
    };

    return (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Input Zone */}
            <div className="lg:col-span-5 flex flex-col gap-md">
                <div className="flex flex-col gap-base">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-widest px-xs">Canvas Alpha</span>
                    <label className="group relative aspect-4/3 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-surface-container transition-all duration-300 shadow-sm overflow-hidden">
                        {preview1 ? (
                            <img src={preview1} alt="Canvas Alpha" className="w-full h-full object-cover animate-fadeIn" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors mb-sm" style={{ fontSize: "48px" }}>filter_vintage</span>
                                <p className="font-label-md text-label-md text-on-surface-variant">Image 1</p>
                                <p className="font-label-sm text-label-sm text-outline">Drop or Click to Upload</p>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handlePhoto1Change} className="hidden" />
                    </label>
                </div>

                <div className="flex flex-col gap-base">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-widest px-xs">Canvas Beta</span>
                    <label className="group relative aspect-4/3 bg-surface-container-low border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-surface-container transition-all duration-300 shadow-sm overflow-hidden">
                        {preview2 ? (
                            <img src={preview2} alt="Canvas Beta" className="w-full h-full object-cover animate-fadeIn" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors mb-sm" style={{ fontSize: "48px" }}>potted_plant</span>
                                <p className="font-label-md text-label-md text-on-surface-variant">Image 2</p>
                                <p className="font-label-sm text-label-sm text-outline">Drop or Click to Upload</p>
                            </>
                        )}
                        <input type="file" accept="image/*" onChange={handlePhoto2Change} className="hidden" />
                    </label>
                </div>

                <button 
                    onClick={handleMerge}
                    disabled={!photo1 || !photo2 || isLoading}
                    className="w-full mt-base py-md px-lg bg-primary text-on-primary font-headline-sm text-headline-sm rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-sm group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>{isLoading ? 'autorenew' : 'auto_awesome'}</span>
                    <span>{isLoading ? 'Merging...' : 'Merge Images'}</span>
                </button>
                {message && <p className="text-center font-label-sm mt-2">{message}</p>}
            </div>

            {/* Preview Zone */}
            <div className="lg:col-span-7">
                <div className="flex flex-col gap-base">
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-widest px-xs">Botanical Result</span>
                    <div className="bg-surface-container-highest rounded-xl p-md shadow-sm border border-outline-variant/10 min-h-125 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Decorative Leaf Patterns */}
                        <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: "80px" }}>eco</span>
                        </div>
                        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: "80px" }}>forest</span>
                        </div>

                        {/* Result / Placeholder */}
                        <div className="mat-border rounded-xl shadow-lg max-w-full overflow-hidden bg-surface relative min-h-75 w-full flex items-center justify-center">
                            {mergedImage ? (
                                <img src={mergedImage} alt="Botanical Result" className="w-full h-auto animate-fadeIn" />
                            ) : (
                                <>
                                    <img 
                                        alt="Preview Placeholder" 
                                        className="w-full h-auto opacity-30 grayscale sepia" 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC72FqiZJhfr0fmbG6yx5-8WTg_eXOp5oUc6abtYDbpToFHOjXiK3b4IJ3SFg5L0OAW-GpaAFRoruBUCnJH1dUVCb5u6CNK0c7nHk9CaEQDPgZupGVqh_eaGMjTvBAjPi89J8C0C6R2B33IJiElsxpX1py32mwP3gyUS5tgStBkGmcjsvwlIL9cVvApFWsekuR1ulB3WOqoW6Dx_hzqP3OvirnKT4iQQrMrTGYjlXDn1UFjLT-ij2OT0EnZOjhi6u1vaADzYE2EMnA"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-lg">
                                        <span className="material-symbols-outlined text-primary/20 mb-md" style={{ fontSize: "64px" }}>temp_preferences_custom</span>
                                        <p className="font-headline-sm text-headline-sm text-on-surface-variant/40">Your creation will appear here</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Download Action */}
                        <button 
                            onClick={handleDownload}
                            disabled={!mergedImage}
                            className={`mt-lg px-xl py-md bg-secondary text-on-secondary font-label-md text-label-md rounded-full shadow-md hover:bg-secondary/90 hover:scale-105 transition-all flex items-center gap-base ${!mergedImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-symbols-outlined">download</span>
                            Download Merged Image
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Grid;
