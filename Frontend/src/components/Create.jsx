import { useState } from "react";
import axios from "axios";

const Create = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerateImage = async () => {
    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    setLoading(true);
    setImageUrl(""); // Clear previous image

    try {
      const response = await axios.post(
        "http://127.0.0.1:6005/generate-image",
        {
          prompt,
        }
      );
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create an Image</h1>
      <input
        type="text"
        placeholder="Enter a prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-80 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
      />
      <button
        onClick={handleGenerateImage}
        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
      >
        Generate
      </button>

      {loading && (
        <p className="mt-6 text-gray-600 text-lg animate-pulse">Loading...</p>
      )}

      {imageUrl && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Generated Image:
          </h2>
          <img
            src={imageUrl}
            alt="Generated"
            className="max-w-full h-auto border border-gray-300 rounded-md shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default Create;
