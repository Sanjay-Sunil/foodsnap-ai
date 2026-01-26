/**
 * Upload an image to imgbb and return the response
 * @param {string} base64Image - Base64 encoded image data (with or without data URL prefix)
 * @returns {Promise<Object>} - The imgbb API response JSON
 */
export const uploadToImgbb = async (base64Image) => {
  const API_KEY = '7099a56971e1a7afff04ea2e1dd494a2';

  // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
  const base64Data = base64Image.includes(',')
    ? base64Image.split(',')[1]
    : base64Image;

  const formData = new FormData();
  formData.append('key', API_KEY);
  formData.append('image', base64Data);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const jsonResponse = await response.json();

    if (jsonResponse.success) {
      console.log('Image URL:', jsonResponse.data.url);
      console.log('Full imgbb response:', jsonResponse);
    } else {
      console.error('imgbb upload failed:', jsonResponse);
    }

    return jsonResponse;
  } catch (error) {
    console.error('Error uploading to imgbb:', error);
    throw error;
  }
};
