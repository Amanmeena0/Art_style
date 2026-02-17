import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  onImageSelect?: (file: File, preview: string) => void;
  preview?: string;
}

export default function ImageUpload({ label, onImageSelect, preview }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | undefined>(preview);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLocalPreview(result);
        onImageSelect?.(file, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{label}</h3>
      
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {localPreview ? (
        <div className="flex-1 relative rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-50">
          <img 
            src={localPreview} 
            alt={label} 
            className="w-full h-full object-cover"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700"
            size="sm"
          >
            Change Image
          </Button>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          className="flex-1 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-medium">Click to upload</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        </button>
      )}
    </div>
  );
}
