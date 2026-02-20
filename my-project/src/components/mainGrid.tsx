import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import type { ChangeEvent } from "react";



const Grid : React.FC = () => {

    const [photo1, setPhoto1] = useState<File | null>(null);
    const [preview1, setPreview1] = useState<string | null>(null);
    const [photo2, setPhoto2] = useState<File | null>(null);
    const [preview2, setPreview2] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

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

    const handleUpload = async () => {
        if(!photo1 || !photo2){
            setMessage("Please select both photos first");
            return;
        }

        const formData = new FormData();
        formData.append("photo1", photo1);
        formData.append("photo2", photo2);

        try{
            const response = await fetch("http://localhost:5174/", {
                method: "POST",
                body: formData,
            });

            if(response.ok){
                setMessage("Photos uploaded successfully");
            } else {
                setMessage("Upload failed ");
            }

        }catch {
            setMessage("Server error during upload")
        }
    };

    return(
        <div className="bg-linear-to-br from-blue-50 to-blue-100 flex-1 h-full overflow-auto p-6">
            {/* Upload Section */}
            <div className="max-w-6xl mx-auto h-full flex flex-col gap-4">
                
                {/* Image Upload Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    {/* Image 1 Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Style image
                        </h3>
                        
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors bg-blue-50 hover:bg-blue-100 flex items-center justify-center min-h-52">
                                {preview1 ? (
                                    <img
                                        src={preview1}
                                        alt="Preview 1"
                                        className="max-h-75 max-w-full object-contain rounded-lg animate-fadeIn"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-blue-600 font-medium">Click to upload</p>
                                        <p className="text-xs text-blue-400">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handlePhoto1Change} className="hidden" />
                        </label>
                    </div>

                    {/* Image 2 Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Content image
                        </h3>
                        
                        <label className="flex-1 cursor-pointer">
                            <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 hover:border-blue-500 transition-colors bg-blue-50 hover:bg-blue-100 flex items-center justify-center min-h-52">
                                {preview2 ? (
                                    <img
                                        src={preview2}
                                        alt="Preview 2"
                                        className="max-h-75 max-w-full object-contain rounded-lg animate-fadeIn"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-blue-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-blue-600 font-medium">Click to upload</p>
                                        <p className="text-xs text-blue-400">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handlePhoto2Change} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Merge Button */}
                <div className="text-center py-4">
                    <Button 
                        onClick={handleUpload}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={!photo1 || !photo2}
                    >
                        <svg className="w-6 h-6 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Merge Images
                    </Button>
                </div>

                {/* Result Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-300 min-h-50 animate-fadeIn">
                    <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Result
                    </h3>
                    <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 min-h-44 flex items-center justify-center bg-blue-50">
                        {message ? (
                            <p className={`text-sm font-medium ${
                                message.includes('success') ? 'text-green-600' : 
                                message.includes('error') || message.includes('failed') ? 'text-red-600' : 
                                'text-blue-600'
                            }`}>{message}</p>
                        ) : (
                            <p className="text-blue-400 text-sm">Result will appear here after merging</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Grid;