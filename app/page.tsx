'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      setError('仅支持 JPG、PNG、WebP 格式');
      return false;
    }
    if (file.size > maxSize) {
      setError('文件大小不能超过 10MB');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('处理失败，请稍后重试');
      }
      
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
          🖼️ Background Remover
        </h1>
        <p className="text-center text-gray-600 mb-8">一键移除图片背景，简单快速</p>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div 
            className={`border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-5xl md:text-6xl mb-4">📁</div>
            <p className="text-gray-600 mb-2">拖拽图片到这里或点击上传</p>
            <p className="text-xs text-gray-400">支持 JPG、PNG、WebP，最大 10MB</p>
            {file && (
              <div className="mt-4 text-sm">
                <p className="text-blue-600 font-medium">{file.name}</p>
                <p className="text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                处理中...
              </>
            ) : '移除背景'}
          </button>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">原图</h3>
                  <div className="relative rounded-lg overflow-hidden shadow-md bg-gray-100">
                    <img src={URL.createObjectURL(file!)} alt="Original" className="w-full" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-2">处理后</h3>
                  <div className="relative rounded-lg overflow-hidden shadow-md" style={{
                    backgroundImage: 'repeating-conic-gradient(#e5e7eb 0% 25%, #f3f4f6 0% 50%)',
                    backgroundSize: '20px 20px'
                  }}>
                    <img src={result} alt="Processed" className="w-full" />
                  </div>
                </div>
              </div>
              <a
                href={result}
                download={`${file!.name.split('.')[0]}-no-bg.png`}
                className="block text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
              >
                📥 下载图片
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
