import axios from 'axios';

export const authenticateFace = async (imageData) => {
  try {
    const response = await axios.post('/api/face-authenticate', imageData);
    return response.data;
  } catch (error) {
    console.error('Face authentication failed', error);
    throw error;
  }
};
