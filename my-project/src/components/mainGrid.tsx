import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import type { ChangeEvent } from "react";



const Grid : React.FC = () => {

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

        if(!file.type.startsWith("image/")){
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

        if(!file.type.startsWith("image/")){
            setMessage("Please select a valid image file");
            return;
        }
        
        setPhoto2(file);
        setPreview2(URL.createObjectURL(file));
        setMessage("");

    };

    const handleMerge = async () => {
        if(!photo1 || !photo2){
            setMessage("Please select both photos first");
            return;
        }

        const formData = new FormData();
        formData.append("style", photo1);
        formData.append("content", photo2);

        // Debug: Log file information
        console.log("📸 MERGE DEBUG INFO:");
        console.log("Style Image -", { name: photo1.name, size: photo1.size, type: photo1.type });
        console.log("Content Image -", { name: photo2.name, size: photo2.size, type: photo2.type });
        console.log("FormData entries:", Array.from(formData.entries()).map(([key, value]) => ({
            key,
            value: value instanceof File ? `${value.name} (${value.size} bytes)` : value
        })));

        try{
            setIsLoading(true);
            setMessage("🔄 Uploading images... please wait");
            setMergedImage(null);
            console.log("🚀 Attempting to connect to http://127.0.0.1:8000/upload");
            
            const uploadResponse = await fetch("http://127.0.0.1:8000/upload", {
                method: "POST",
                body: formData,
            });

            console.log("✅ Upload response received:");
            console.log("Status:", uploadResponse.status);
            console.log("Status Text:", uploadResponse.statusText);
            
            if(uploadResponse.ok){
                const uploadData = await uploadResponse.json();
                console.log("Upload Data:", uploadData);
                
                const sessionId = uploadData.session_id;
                
                if(!sessionId){
                    setMessage("❌ No session_id received from upload");
                    return;
                }

                // Now fetch the result using session_id with polling
                setMessage("🔄 Merging images... please wait");
                console.log(`🎨 Fetching result for session: ${sessionId}`);
                
                // Poll for result (try multiple times with delays)
                let resultData = null;
                const maxAttempts = 30; // Try for up to 60 seconds (30 attempts * 2 seconds)
                const delayMs = 2000; // Wait 2 seconds between attempts
                
                for(let attempt = 1; attempt <= maxAttempts; attempt++){
                    console.log(`Attempt ${attempt}/${maxAttempts} - Fetching result...`);
                    setMessage(`🔄 Merging images... (${attempt}/${maxAttempts})`);
                    
                    const resultResponse = await fetch(`http://127.0.0.1:8000/result/${sessionId}`);
                    
                    if(resultResponse.ok){
                        resultData = await resultResponse.json();
                        console.log("✅ Result received:", resultData);
                        break; // Success! Exit the loop
                    } else if(resultResponse.status === 404){
                        console.log(`Result not ready yet, waiting ${delayMs}ms...`);
                        // Wait before next attempt
                        await new Promise(resolve => setTimeout(resolve, delayMs));
                    } else {
                        // Other error occurred
                        const errorText = await resultResponse.text();
                        console.error("Result fetch error:", errorText);
                        setMessage(`❌ Failed to fetch result - Status: ${resultResponse.status}`);
                        return;
                    }
                }
                
                if(resultData){
                    // The image_data contains the base64 data URL
                    setMergedImage(resultData.image_data);
                    setMessage("✅ Images merged successfully!");
                } else {
                    setMessage("❌ Timeout: Result not ready after multiple attempts");
                }
            } else {
                const errorText = await uploadResponse.text();
                console.error("Upload error response:", errorText);
                setMessage(`❌ Upload failed - Status: ${uploadResponse.status} ${uploadResponse.statusText}`);
            }

        }catch (error) {
            console.error("❌ Merge error:", error);
            setMessage(`Server error: ${error instanceof Error ? error.message : "Unknown error"}`);
            console.error("Details:", error);
        } finally {
            setIsLoading(false);
        }
        
    };


    return(
        <div className="bg-linear-to-br from-blue-50 to-blue-100 flex-1 overflow-auto">
            {/* Upload Section */}
            <div className="w-full flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
                
                {/* Image Upload Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    {/* Image 1 Upload */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col">
                        <h3 className="text-base sm:text-lg md:text-lg font-semibold text-blue-700 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">Style image</span>
                        </h3>
                        
                        <label className="flex-1 cursor-pointer flex">
                            <div className="border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-4 hover:border-blue-500 transition-colors bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-full min-h-40 sm:min-h-48 md:min-h-52">
                                {preview1 ? (
                                    <img
                                        src={preview1}
                                        alt="Preview 1"
                                        className="max-h-48 sm:max-h-60 md:max-h-80 max-w-full object-contain rounded-lg animate-fadeIn"
                                    />
                                ) : (
                                    <div className="text-center p-2">
                                        <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-600 font-medium">Click to upload</p>
                                        <p className="text-xs text-blue-400">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handlePhoto1Change} className="hidden" />
                        </label>
                    </div>

                    {/* Image 2 Upload */}
                    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl transform hover:-translate-y-0.5 sm:hover:-translate-y-1 flex flex-col">
                        <h3 className="text-base sm:text-lg md:text-lg font-semibold text-blue-700 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="truncate">Content image</span>
                        </h3>
                        
                        <label className="flex-1 cursor-pointer flex">
                            <div className="border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-4 hover:border-blue-500 transition-colors bg-blue-50 hover:bg-blue-100 flex items-center justify-center w-full min-h-40 sm:min-h-48 md:min-h-52">
                                {preview2 ? (
                                    <img
                                        src={preview2}
                                        alt="Preview 2"
                                        className="max-h-48 sm:max-h-60 md:max-h-80 max-w-full object-contain rounded-lg animate-fadeIn"
                                    />
                                ) : (
                                    <div className="text-center p-2">
                                        <svg className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-600 font-medium">Click to upload</p>
                                        <p className="text-xs text-blue-400">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handlePhoto2Change} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Merge Button */}
                <div className="text-center py-2 sm:py-3 md:py-4">
                    <Button 
                        onClick={handleMerge}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-6 text-xs sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl md:rounded-xl shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl transform hover:scale-100 sm:hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                        disabled={!photo1 || !photo2 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Merging...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-1 sm:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                Merge Images
                            </>
                        )}
                    </Button>
                </div>

                {/* Result Section */}
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-6 border-2 border-blue-300 min-h-32 sm:min-h-40 md:min-h-50 animate-fadeIn flex flex-col">
                    <h3 className="text-base sm:text-lg md:text-lg font-semibold text-blue-700 mb-2 sm:mb-3 md:mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">Merged Result</span>
                    </h3>
                    <div className="border-2 border-dashed border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 min-h-28 sm:min-h-32 md:min-h-44 flex items-center justify-center bg-blue-50 flex-1">
                        {mergedImage ? (
                            <img
                                src={mergedImage}
                                alt="Merged Result"
                                className="max-h-48 sm:max-h-60 md:max-h-80 max-w-full object-contain rounded-lg animate-fadeIn"
                            />
                        ) : message ? (
                            <p className={`text-xs sm:text-sm md:text-sm font-medium text-center wrap-break-word ${
                                message.includes('success') ? 'text-green-600' : 
                                message.includes('error') || message.includes('failed') ? 'text-red-600' : 
                                message.includes('Merging') ? 'text-blue-600' :
                                'text-blue-600'
                            }`}>{message}</p>
                        ) : (
                            <p className="text-blue-400 text-xs sm:text-sm text-center">Result will appear here after merging</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Grid;