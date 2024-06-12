const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.post('/generate-image', upload.single('image'), async (req, res) => {
  const imagePath = req.file.path;

  try {
    const imageData = fs.readFileSync(imagePath);

    // Ensure imageData is a buffer
    if (!(imageData instanceof Buffer)) {
      throw new Error('Image data is not a buffer');
    }

    // Use the create method of OpenAIApi properly
    const response = await openai.images.create({
      model: 'image-stylization-v1', // Specify the model you want to use
      images: [imageData.toString('base64')],
    });

    const imageUrl = response.data.output_url;
    res.json({ image_url: imageUrl });

    // Delete the uploaded file after processing
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Error generating image:', error.message);
    res.status(500).json({ message: 'Error generating image' });
  }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
