import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '../../lib/supabaseClient';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function fileToGenerativePart(base64, mimeType) {
  return {
    inlineData: {
      data: base64,
      mimeType
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(500).json({ error: 'La API Key de Google no está configurada.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = '¿Qué animal es este? Describe brevemente lo que ves en la imagen. Si no es un animal, indícalo.';

    const imagePart = fileToGenerativePart(image, 'image/jpeg'); // Asumimos jpeg, pero podría ser png, etc.

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Guardar el resultado en Supabase
    const { error: insertError } = await supabase
      .from('recognitions')
      .insert([{ result_text: text }]);

    if (insertError) {
      // No bloqueamos la respuesta al usuario, pero sí lo registramos
      console.error('Error saving to Supabase:', insertError);
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error('Error al contactar la API de Gemini:', error);
    res.status(500).json({ error: 'Error al procesar la imagen con la API de Gemini.' });
  }
}
