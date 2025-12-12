import React, { useState } from 'react';
import Head from 'next/head';

// Importa o Puter.js diretamente do CDN no lado do cliente
const puterScript = "https://js.puter.com/v2/";

function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // A função que chama a API Puter.js
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Por favor, insira um prompt.");
      return;
    }

    // 1. Verifica se a biblioteca Puter está carregada
    if (typeof puter === 'undefined') {
      setError("Puter.js não carregado. Tente recarregar a página.");
      return;
    }

    setIsLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      // 2. Chama a função text-to-image do Puter
      // O modelo "gemini-3-pro-image-preview" é o 'Nano Banana Pro' de alta qualidade
      const imageElement = await puter.txt2img(prompt, {
        model: "gemini-3-pro-image-preview" 
      });

      // 3. Obtém a URL da imagem gerada
      if (imageElement && imageElement.src) {
        setImageUrl(imageElement.src);
      } else {
        setError("Geração de imagem falhou. Verifique o console para detalhes.");
      }
      
    } catch (err) {
      console.error("Erro na geração de imagem:", err);
      // O Puter exibe um popup de pagamento/login para o usuário.
      // Este erro de código geralmente significa que o usuário cancelou ou falhou na autenticação.
      setError("Erro ao gerar imagem. Confirme a autenticação via pop-up do Puter.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Nano Banana (Gemini) Image Generator</title>
        {/* Carrega o Puter.js globalmente no navegador */}
        <script src={puterScript} async defer></script>
      </Head>

      <h1>🍌 Gerador de Imagens Puter/Gemini</h1>
      <p>Desenvolvido com Puter.js (Nano Banana API) e Vercel.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Um gato astronauta surfando em Marte"
          disabled={isLoading}
          style={{ width: 'calc(100% - 120px)', padding: '10px', marginRight: '10px', border: '1px solid #ccc' }}
        />
        <button
          onClick={generateImage}
          disabled={isLoading}
          style={{ padding: '10px 15px', cursor: 'pointer', backgroundColor: isLoading ? '#aaa' : '#0070f3', color: 'white', border: 'none' }}
        >
          {isLoading ? 'Gerando...' : 'Gerar Imagem'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}
      
      {isLoading && (
        <p>Aguarde... A geração pode levar alguns segundos e o Puter.js pode solicitar que você confirme sua conta/pagamento em um pop-up.</p>
      )}

      {imageUrl && (
        <div>
          <h2>Imagem Gerada</h2>
          <img 
            src={imageUrl} 
            alt={prompt} 
            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '5px' }} 
          />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
