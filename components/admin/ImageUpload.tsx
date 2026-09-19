'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  label?: string;
  description?: string;
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  folder = '/qadri-cms',
  label = 'Image',
  description = 'Upload an image (PNG, JPG, WEBP, up to 10MB) or enter a URL path.',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setError(null);

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.');
      return;
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setIsUploading(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const applyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setError(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-stone-700">{label}</label>
        <button
          type="button"
          onClick={() => setUrlMode(!urlMode)}
          className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 underline underline-offset-2"
        >
          <Link2 className="w-3 h-3" />
          {urlMode ? 'Upload from computer' : 'Paste image URL / path'}
        </button>
      </div>

      {description && <p className="text-xs text-stone-500">{description}</p>}

      {urlMode ? (
        <div className="flex gap-2">
          <Input
            placeholder="e.g. /hero-images/drinking-horn.jpg or https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white border-stone-300"
          />
          <Button
            type="button"
            variant="outline"
            onClick={applyUrl}
            className="border-stone-300"
          >
            Apply
          </Button>
        </div>
      ) : null}

      {/* Preview and Upload Box */}
      {value ? (
        <div className="relative rounded-lg border border-stone-200 bg-stone-50 overflow-hidden p-2 group">
          <div className="relative w-full h-48 bg-stone-900/5 rounded flex items-center justify-center overflow-hidden">
            <img
              src={value}
              alt="Uploaded preview"
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between px-1">
            <span className="text-xs text-stone-500 truncate max-w-[280px]" title={value}>
              {value}
            </span>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-xs border-stone-300"
              >
                Change
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  onChange('');
                  setUrlInput('');
                  if (onRemove) onRemove();
                }}
                className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-stone-800 bg-stone-50'
              : 'border-stone-300 hover:border-stone-400 bg-stone-50/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <Loader2 className="w-8 h-8 text-stone-600 animate-spin" />
              <p className="text-sm font-medium text-stone-700">Uploading to ImageKit...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="p-3 bg-stone-100 rounded-full text-stone-600">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Click to browse or drag and drop image here
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Supports JPG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-rose-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
