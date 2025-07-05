import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Por favor, selecciona una imagen.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result.split(',')[1];
      try {
        const response = await fetch('/api/recognize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ocurrió un error al procesar la imagen.');
        }

        setResult(data.text);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
        setError('No se pudo leer el archivo.');
        setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Reconocimiento de Animales con IA
        </h1>

        <p className={styles.description}>
          Sube una imagen de un animal y Gemini te dirá qué es.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          <button type="submit" disabled={loading || !file} className={styles.button}>
            {loading ? 'Reconociendo...' : 'Reconocer Animal'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {preview && !result && !loading && (
          <div className={styles.previewContainer}>
            <h2>Vista Previa:</h2>
            <img src={preview} alt="Vista previa de la imagen" className={styles.previewImage} />
          </div>
        )}

        {loading && (
            <div className={styles.loader}></div>
        )}

        {result && (
          <div className={styles.resultCard}>
            <h2>Resultado del Reconocimiento:</h2>
            <p>{result}</p>
          </div>
        )}
      </main>
    </div>
  );
}
