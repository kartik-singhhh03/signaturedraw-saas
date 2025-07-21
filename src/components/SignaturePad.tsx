import React, { useRef, useEffect, useState } from 'react';
import { Download, RotateCcw, Trash2, PenTool, FileText, Compass as Compress, Palette } from 'lucide-react';
import jsPDF from 'jspdf';
import { trackEvent } from './Analytics';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './LoadingSpinner';

const SignaturePad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Array<Array<{x: number, y: number}>>>([]);
  const [currentStroke, setCurrentStroke] = useState<Array<{x: number, y: number}>>([]);
  const [hasSignature, setHasSignature] = useState(false);
  const [showCompressionModal, setShowCompressionModal] = useState(false);
  const [compressionType, setCompressionType] = useState<'png' | 'pdf'>('png');
  const [targetSize, setTargetSize] = useState<string>('500');
  const [sizeUnit, setSizeUnit] = useState<'KB' | 'MB'>('KB');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { success, error } = useToast();

  const colorPresets = [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Light Gray', value: '#F3F4F6' },
    { name: 'Cream', value: '#FFFBEB' },
    { name: 'Light Blue', value: '#EFF6FF' },
    { name: 'Light Green', value: '#F0FDF4' },
    { name: 'Transparent', value: 'transparent' }
  ];
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Set drawing styles
      ctx.strokeStyle = '#000000'; // Always black for signature
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Set background color
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Redraw existing strokes
      redrawStrokes();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load saved signature
    const savedSignature = localStorage.getItem('signature-strokes');
    if (savedSignature) {
      const parsedStrokes = JSON.parse(savedSignature);
      setStrokes(parsedStrokes);
      setHasSignature(parsedStrokes.length > 0);
    }

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [backgroundColor]);

  useEffect(() => {
    redrawStrokes();
  }, [strokes]);

  const redrawStrokes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background color
    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.strokeStyle = '#000000'; // Always black for signature
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.length > 1) {
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      }
    });
  };

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getEventPos(e);
    setCurrentStroke([pos]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const pos = getEventPos(e);
    const newStroke = [...currentStroke, pos];
    setCurrentStroke(newStroke);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (newStroke.length > 1) {
      const prevPos = newStroke[newStroke.length - 2];
      ctx.beginPath();
      ctx.moveTo(prevPos.x, prevPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentStroke.length > 1) {
      const newStrokes = [...strokes, currentStroke];
      setStrokes(newStrokes);
      setHasSignature(true);
      localStorage.setItem('signature-strokes', JSON.stringify(newStrokes));
    }
    setCurrentStroke([]);
  };

  const clearSignature = () => {
    setStrokes([]);
    setCurrentStroke([]);
    setHasSignature(false);
    localStorage.removeItem('signature-strokes');
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Restore background color after clearing
      if (backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const undoLastStroke = () => {
    if (strokes.length > 0) {
      const newStrokes = strokes.slice(0, -1);
      setStrokes(newStrokes);
      setHasSignature(newStrokes.length > 0);
      localStorage.setItem('signature-strokes', JSON.stringify(newStrokes));
    }
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    setIsProcessing(true);
    trackEvent('signature_download_png');

    // Create a new canvas with white background for download
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');
    if (!downloadCtx) return;

    downloadCanvas.width = canvas.width;
    downloadCanvas.height = canvas.height;

    // Set background color for download
    if (backgroundColor !== 'transparent') {
      downloadCtx.fillStyle = backgroundColor;
      downloadCtx.fillRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    } else {
      downloadCtx.clearRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    }
    
    // Draw the signature
    downloadCtx.strokeStyle = '#000000';
    downloadCtx.lineWidth = 2;
    downloadCtx.lineCap = 'round';
    downloadCtx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.length > 1) {
        downloadCtx.beginPath();
        downloadCtx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          downloadCtx.lineTo(stroke[i].x, stroke[i].y);
        }
        downloadCtx.stroke();
      }
    });

    // Download the image
    downloadCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'signature.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        success('PNG Downloaded', 'Your signature has been saved successfully!');
      } else {
        error('Download Failed', 'Unable to generate PNG file. Please try again.');
      }
      setIsProcessing(false);
    }, 'image/png');
  };

  const downloadPDF = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    setIsProcessing(true);
    trackEvent('signature_download_pdf');

    try {
    // Create a temporary canvas with background for PDF
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Set background (default to white for PDF if transparent)
    const pdfBgColor = backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor;
    tempCtx.fillStyle = pdfBgColor;
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw signature
    tempCtx.strokeStyle = '#000000';
    tempCtx.lineWidth = 2;
    tempCtx.lineCap = 'round';
    tempCtx.lineJoin = 'round';

    strokes.forEach(stroke => {
      if (stroke.length > 1) {
        tempCtx.beginPath();
        tempCtx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          tempCtx.lineTo(stroke[i].x, stroke[i].y);
        }
        tempCtx.stroke();
      }
    });
    const pdf = new jsPDF();
    const imgData = tempCanvas.toDataURL('image/png');
    
    // Calculate dimensions to fit the signature nicely in PDF
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth * 0.8; // 80% of page width
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
    pdf.save('signature.pdf');
      success('PDF Downloaded', 'Your signature PDF has been saved successfully!');
    } catch (err) {
      error('PDF Generation Failed', 'Unable to create PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const compressAndDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    setIsProcessing(true);
    trackEvent('signature_compress', { type: compressionType, targetSize: targetSize + sizeUnit });

    const targetSizeBytes = parseFloat(targetSize) * (sizeUnit === 'KB' ? 1024 : 1024 * 1024);
    
    if (compressionType === 'png') {
      // Binary search for optimal quality
      let quality = 0.9;
      let minQuality = 0.1;
      let maxQuality = 1.0;
      let attempts = 0;
      const maxAttempts = 10;
      
      const findOptimalQuality = () => {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const sizeBytes = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
        
        if (attempts >= maxAttempts || Math.abs(sizeBytes - targetSizeBytes) < targetSizeBytes * 0.1) {
          // Convert back to PNG for download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `signature-compressed.png`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              success('Compressed PNG Downloaded', `File optimized to ~${targetSize}${sizeUnit}`);
            }
            setIsProcessing(false);
          }, 'image/png', quality);
          return;
        }
        
        attempts++;
        if (sizeBytes > targetSizeBytes) {
          maxQuality = quality;
          quality = (minQuality + quality) / 2;
        } else {
          minQuality = quality;
          quality = (quality + maxQuality) / 2;
        }
        
        setTimeout(findOptimalQuality, 10);
      };
      
      findOptimalQuality();
    } else {
      // PDF compression
      const pdf = new jsPDF();
      let quality = 0.9;
      
      const imgData = canvas.toDataURL('image/jpeg', quality);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth * 0.8;
      const imgHeight = (canvas.height / canvas.width) * imgWidth;
      
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
      pdf.save('signature-compressed.pdf');
      success('Compressed PDF Downloaded', `File optimized to ~${targetSize}${sizeUnit}`);
      setIsProcessing(false);
    }
    
    setShowCompressionModal(false);
  };

  const handleClearSignature = () => {
    clearSignature();
    trackEvent('signature_clear');
    success('Canvas Cleared', 'Ready for a new signature!');
  };

  const handleUndoStroke = () => {
    undoLastStroke();
    trackEvent('signature_undo');
  };
  return (
    <>
      <section id="signature-pad" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Digital Signature Pad
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Use your mouse, finger, or stylus to draw your signature below.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Canvas Container */}
          <div className="relative mb-8">
            {/* Background Color Picker */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                title="Change background color"
              >
                <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <div 
                  className="w-4 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor }}
                ></div>
              </button>
              
              {showColorPicker && (
                <div className="absolute top-12 right-0 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 min-w-48 z-20">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Background Color</h4>
                  
                  {/* Color Presets */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {colorPresets.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => {
                          setBackgroundColor(preset.value);
                          setShowColorPicker(false);
                        }}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          backgroundColor === preset.value
                            ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ 
                            backgroundColor: preset.value === 'transparent' ? '#FFFFFF' : preset.value,
                            backgroundImage: preset.value === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                            backgroundSize: preset.value === 'transparent' ? '8px 8px' : 'auto',
                            backgroundPosition: preset.value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                          }}
                        ></div>
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Color Input */}
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Custom Color</label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={backgroundColor === 'transparent' ? '#FFFFFF' : backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <canvas
              ref={canvasRef}
              className="w-full h-64 sm:h-80 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-crosshair touch-none"
              style={{ backgroundColor: backgroundColor === 'transparent' ? 'white' : backgroundColor }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <PenTool className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg font-medium">Start drawing your signature</p>
                  <p className="text-sm">Click and drag to sign</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleClearSignature}
              disabled={isProcessing}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
            
            <button
              onClick={handleUndoStroke}
              disabled={strokes.length === 0 || isProcessing}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Undo</span>
            </button>
            
            <button
              onClick={downloadSignature}
              disabled={!hasSignature || isProcessing}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              {isProcessing ? <LoadingSpinner size="sm" color="text-white" /> : <Download className="w-4 h-4" />}
              <span>Download PNG</span>
            </button>
            
            <button
              onClick={downloadPDF}
              disabled={!hasSignature || isProcessing}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              {isProcessing ? <LoadingSpinner size="sm" color="text-white" /> : <FileText className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>
            
            <button
              onClick={() => setShowCompressionModal(true)}
              disabled={!hasSignature || isProcessing}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
            >
              {isProcessing ? <LoadingSpinner size="sm" color="text-white" /> : <Compress className="w-4 h-4" />}
              <span>Compress & Download</span>
            </button>
          </div>

          {hasSignature && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-700 dark:text-green-300 text-center">
                ✅ Signature ready! Choose your preferred download format above.
              </p>
            </div>
          )}
        </div>
      </div>
      </section>

      {/* Compression Modal */}
      {showCompressionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Compress & Download
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  File Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="png"
                      checked={compressionType === 'png'}
                      onChange={(e) => setCompressionType(e.target.value as 'png' | 'pdf')}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">PNG</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="pdf"
                      checked={compressionType === 'pdf'}
                      onChange={(e) => setCompressionType(e.target.value as 'png' | 'pdf')}
                      className="mr-2"
                    />
                    <span className="text-gray-700 dark:text-gray-300">PDF</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Size (Optional)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="500"
                  />
                  <select
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value as 'KB' | 'MB')}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCompressionModal(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={compressAndDownload}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignaturePad;