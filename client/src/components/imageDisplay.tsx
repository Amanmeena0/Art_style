interface ImageDisplayProps {
  label: string;
  imageSrc?: string;
  isLoading?: boolean;
}

export default function ImageDisplay({ label, imageSrc, isLoading }: ImageDisplayProps) {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{label}</h3>
      
      <div className="flex-1 rounded-lg border-2 border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Processing...</p>
          </div>
        ) : imageSrc ? (
          <img 
            src={imageSrc} 
            alt={label} 
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-gray-500 text-center text-sm">
            {label} will appear here
          </p>
        )}
      </div>
    </div>
  );
}
