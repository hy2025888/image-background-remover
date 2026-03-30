'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });
      
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      alert('处理失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🖼️ Background Remover
        </h1>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-600">点击上传图片</p>
              {file && <p className="mt-2 text-sm text-blue-600">{file.name}</p>}
            </label>
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? '处理中...' : '移除背景'}
          </button>

          {result && (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">原图</h3>
                <img src={URL.createObjectURL(file!)} alt="Original" className="rounded-lg shadow-md w-full" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">处理后</h3>
                <img src={result} alt="Processed" className="rounded-lg shadow-md w-full" />
                <a
                  href={result}
                  download="no-bg.png"
                  className="mt-4 block text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  下载图片
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
