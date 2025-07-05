import { useState, useEffect, useRef } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/history');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setError('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const handleFileChange = (e) => handleFileSelect(e.target.files[0]);

  const handleSubmit = async () => {
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ocurrió un error al procesar la imagen.');
        }

        setResult(data.text);
        fetchHistory(); // Refresh history after a new recognition
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('No se pudo leer el archivo.');
      setLoading(false);
    };
  };

  const handleDragEvents = (e, isOver) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <span>Animal</span> Recognizer AI
          </h1>
          <p className={styles.description}>
            Sube una imagen y deja que la IA de Gemini identifique al animal.
          </p>
        </header>

        <div className={styles.contentWrapper}>
          <section className={styles.recognizeSection}>
            <div
              className={`${styles.uploadArea} ${isDragging ? styles.dragover : ''}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <div className={styles.uploadIcon}>🖼️</div>
              <p className={styles.uploadText}>Arrastra y suelta una imagen aquí</p>
              <p className={styles.uploadSubText}>o haz clic para seleccionar un archivo</p>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {preview && (
              <div className={styles.resultCard}>
                <img src={preview} alt="Vista previa" className={styles.previewImage} />
              </div>
            )}
            
            {file && !loading && (
                <button onClick={handleSubmit} disabled={loading} className={styles.button}>
                    Reconocer Animal
                </button>
            )}

            {loading && <div className={styles.loader}></div>}

            {result && (
              <div className={styles.resultCard}>
                <h2>Resultado del Reconocimiento</h2>
                <p>{result}</p>
              </div>
            )}
          </section>

          <aside className={styles.historySection}>
            <h2>Historial Reciente</h2>
            {history.length > 0 ? (
              <ul className={styles.historyList}>
                {history.map((item) => (
                  <li key={item.id} className={styles.historyItem}>
                    <p>{item.result_text}</p>
                    <time>{new Date(item.created_at).toLocaleString()}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.uploadSubText}>No hay reconocimientos todavía.</p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
