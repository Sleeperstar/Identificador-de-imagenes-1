import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('recognitions')
      .select('id, created_at, result_text')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching history from Supabase:', error);
    res.status(500).json({ error: 'Error al obtener el historial.' });
  }
}
