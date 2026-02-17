import { useState } from 'react';
import Sidebar from '../components/sidebar';
import ImageUpload from '../components/imageUpload';
import ImageDisplay from '../components/imageDisplay';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
}

function HomePage() {
  const [image1, setImage1] = useState<{ file: File; preview: string } | null>(null);
  const [image2, setImage2] = useState<{ file: File; preview: string } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  const handleImage1Select = (file: File, preview: string) => {
    setImage1({ file, preview });
  };

  const handleImage2Select = (file: File, preview: string) => {
    setImage2({ file, preview });
  };

  const handleMerge = async () => {
    if (!image1 || !image2) {
      alert('Please upload both images');
      return;
    }

    setIsProcessing(true);
    try {
      // TODO: Replace with your actual API endpoint
      const formData = new FormData();
      formData.append('contentImage', image1.file);
      formData.append('styleImage', image2.file);

      // Example API call - update with your backend URL
      // const response = await fetch('http://localhost:5000/merge', {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      // setResultImage(data.resultImage);

      // Placeholder - remove this after connecting to backend
      setTimeout(() => {
        alert('Backend API endpoint not configured yet');
        setIsProcessing(false);
      }, 1000);
    } catch (error) {
      console.error('Error during merge:', error);
      alert('Error processing images');
      setIsProcessing(false);
    }
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `Chat ${new Date().toLocaleDateString()}`,
      timestamp: Date.now(),
    };
    setChatHistory([newChat, ...chatHistory]);
    setCurrentChat(newChat.id);
    setImage1(null);
    setImage2(null);
    setResultImage(null);
  };

  const handleDeleteChat = (id: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== id));
    if (currentChat === id) {
      setCurrentChat(null);
      setImage1(null);
      setImage2(null);
      setResultImage(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        onNewChat={handleNewChat}
        chatHistory={chatHistory}
        onSelectChat={setCurrentChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-6 shadow-lg">
          <h1 className="text-3xl font-bold">Art Style Merger</h1>
          <p className="text-blue-100 text-sm mt-1">Combine your images with AI-powered style transfer</p>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Upload Section */}
            <div className="grid grid-cols-2 gap-6 h-96">
              <ImageUpload
                label="Image 1 (Content)"
                onImageSelect={handleImage1Select}
                preview={image1?.preview}
              />
              <ImageUpload
                label="Image 2 (Style)"
                onImageSelect={handleImage2Select}
                preview={image2?.preview}
              />
            </div>

            {/* Merge Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleMerge}
                disabled={!image1 || !image2 || isProcessing}
                className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Zap className="w-5 h-5 mr-2" />
                {isProcessing ? 'Merging...' : 'Merge Images'}
              </Button>
            </div>

            {/* Result Section */}
            <div className="h-96">
              <ImageDisplay
                label="Result"
                imageSrc={resultImage || undefined}
                isLoading={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;