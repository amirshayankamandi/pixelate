import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler for file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for removing selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setImage(null); // Clear generated image on remove
  };

  // Handler for generating image
  const handleGenerateImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file first.');
      return;
    }

    setLoading(true);
    setImage(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Adjust URL based on your backend setup
      const response = await axios.post('http://localhost:5003/generate-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setImage(response.data.image_url);
    } catch (error) {
      console.error('Error generating image:', error.message);
      setError('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Generate Modern Stylized PFP</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500"
      />
      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="w-full max-h-64 object-cover rounded-md" />
          <button
            onClick={handleRemoveImage}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Remove Image
          </button>
        </div>
      )}
      <button
        onClick={handleGenerateImage}
        disabled={!selectedFile || loading}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>
      {loading && <div className="loader mt-4"></div>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Generated" className="w-full max-h-64 object-cover rounded-md" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
