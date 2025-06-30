import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { FiShield } from 'react-icons/fi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function LogoExport() {
  const logoRef = useRef();
  const [size, setSize] = useState(256);
  const [transparent, setTransparent] = useState(true);
  const [rounded, setRounded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate PNG with specific parameters
  const generatePng = async (size, transparent) => {
    const style = {
      transform: `scale(${size / 256})`,
      transformOrigin: 'top left',
      width: '256px',
      height: '256px',
    };

    return toPng(logoRef.current, {
      width: size,
      height: size,
      style,
      backgroundColor: transparent ? null : '#1c1b29',
      pixelRatio: 3,
    });
  };

  // Generate ICO file
  const generateIco = async (transparent) => {
    const pngDataUrl = await generatePng(64, transparent);
    return new Promise((resolve) => {
      const img = new Image();
      img.src = pngDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 64, 64);
        canvas.toBlob((blob) => resolve(blob), 'image/x-icon');
      };
    });
  };

  // Download all assets in a ZIP
  const downloadAllAssets = async () => {
    setIsGenerating(true);
    const zip = new JSZip();
    const sizes = [64, 128, 256, 512, 1024];
    
    // Add PNG files to ZIP
    for (const size of sizes) {
      for (const isTransparent of [true, false]) {
        const pngDataUrl = await generatePng(size, isTransparent);
        const blob = await fetch(pngDataUrl).then(r => r.blob());
        const type = isTransparent ? 'transparent' : 'background';
        zip.file(`muhafiz-${size}x${size}-${type}.png`, blob);
      }
    }

    // Add ICO files to ZIP
    for (const isTransparent of [true, false]) {
      const icoBlob = await generateIco(isTransparent);
      const type = isTransparent ? 'transparent' : 'background';
      zip.file(`muhafiz-logo-${type}.ico`, icoBlob);
    }

    // Generate and download ZIP
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'muhafiz-logo-pack.zip');
      setIsGenerating(false);
    });
  };

  // Single file download handler
  const downloadLogo = async (type = 'png') => {
    if (type === 'ico') {
      const blob = await generateIco(transparent);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `muhafiz-logo.ico`;
      link.click();
    } else {
      const pngDataUrl = await generatePng(size, transparent);
      const link = document.createElement('a');
      link.download = `muhafiz-logo-${size}x${size}.png`;
      link.href = pngDataUrl;
      link.click();
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Poppins, sans-serif', marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Logo Preview */}
      <div
        ref={logoRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '32px',
          width: '256px',
          height: '256px',
          borderRadius: rounded ? '50%' : '0',
          backgroundColor: transparent ? 'transparent' : '#1c1b29',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <FiShield style={{ fontSize: '64px', color: '#ff70d1' }} />
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              margin: 0,
              background: 'linear-gradient(90deg, #a259ff, #ff70d1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Muhafiz
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div>
          <label style={{ marginRight: '1rem' }}>
            Export Size:
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              style={dropdownStyle}
            >
              <option value={64}>64x64</option>
              <option value={128}>128x128</option>
              <option value={256}>256x256</option>
              <option value={512}>512x512</option>
              <option value={1024}>1024x1024</option>
            </select>
          </label>
        </div>

        <div style={{ margin: '1.5rem 0' }}>
          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={transparent}
              onChange={() => setTransparent(!transparent)}
            />
            Transparent Background
          </label>

          <label style={checkboxStyle}>
            <input
              type="checkbox"
              checked={rounded}
              onChange={() => setRounded(!rounded)}
            />
            Circular Logo
          </label>
        </div>

        <div>
          <button 
            onClick={() => downloadLogo('png')} 
            style={btnStyle}
            disabled={isGenerating}
          >
            Download PNG
          </button>
          <button 
            onClick={() => downloadLogo('ico')} 
            style={{...btnStyle, backgroundColor: '#4caf50'}}
            disabled={isGenerating}
          >
            Download ICO
          </button>
          <button 
            onClick={downloadAllAssets} 
            style={{...btnStyle, backgroundColor: '#2196f3'}}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating ZIP...' : 'Download All Assets'}
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '12px 24px',
  margin: '0 10px 10px 0',
  backgroundColor: '#a259ff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '16px',
  minWidth: '160px',
  transition: 'opacity 0.3s',
};

const dropdownStyle = {
  marginLeft: '8px',
  padding: '8px 12px',
  fontWeight: '600',
  borderRadius: '6px',
  border: '1px solid #ddd'
};

const checkboxStyle = {
  display: 'inline-block',
  margin: '0 20px 15px',
  fontWeight: '500',
  fontSize: '16px',
};