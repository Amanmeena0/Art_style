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

        <div className="bg-gray-300 items-center text-center flex-1 min-h-screen">
            <h2 className="text-xl font-semibold mb-3">Upload Photo</h2>
            
            <div className="flex gap-4 p-10 justify-center">
            <div className=" p-5 border rounded-xl max-w-md shadow">

                <input type="file" accept="image/*" onChange={handlePhoto1Change} />

                {preview1 && (
                    <img
                    src={preview1}
                    alt="Preview"
                    className="mt-4 w-48 h-48 object-cover rounded-lg border"
                    />
                )}

                <Button
                    onClick={handleUpload}
                    
                >
                    Upload Photo 1
                </Button>

                {message && <p className="mt-2 text-sm">{message}</p>}
            </div>

            <div className="p-5 border rounded-xl max-w-md shadow">

                <input type="file" accept="image/*" onChange={handlePhoto2Change} />

                {preview2 && (
                    <img
                    src={preview2}
                    alt="Preview"
                    className="mt-4 w-48 h-48 object-cover rounded-lg border"
                    />
                )}

                <Button
                    onClick={handleUpload}
                   
                >
                    Upload Photo 2
                </Button>

                {message && <p className="mt-2 text-sm">{message}</p>}
            </div>
            </div>
            <div className="flex-gap p-5 ">
                <Button> Merge </Button>
            </div>
        </div>
    );
}


export default Grid;