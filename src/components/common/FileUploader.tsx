import React, { useState } from 'react';
import { UploadCloud, File, CheckCircle2, X } from 'lucide-react';

interface FileUploaderProps {
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  onFileSelect?: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label = 'Upload Verification Document',
  accept = '.pdf,.png,.jpg,.jpeg',
  maxSizeMb = 5,
  onFileSelect,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMb} MB limit.`);
      return;
    }
    setError(null);
    setSelectedFile(file);
    if (onFileSelect) onFileSelect(file);
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
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-semibold text-eco-muted">{label}</label>}

      {selectedFile ? (
        <div className="eco-card p-3.5 flex items-center justify-between border-eco-green/40 bg-eco-green/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-eco-green/15 text-eco-green">
              <File className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-eco-muted">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for verification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-eco-green font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Selected
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (onFileSelect) onFileSelect(null);
              }}
              className="p-1 text-eco-muted hover:text-white rounded-lg hover:bg-eco-surface"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`eco-card p-6 border-2 border-dashed text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-eco-green bg-eco-green/10'
              : 'border-eco-border hover:border-eco-borderLight bg-eco-surface/40'
          }`}
        >
          <input
            type="file"
            accept={accept}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            id="file-upload-input"
          />
          <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center">
            <div className="p-3 rounded-full bg-eco-surface border border-eco-border text-eco-green mb-2.5">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-white">
              <span className="text-eco-green hover:underline">Click to upload</span> or drag and drop
            </p>
            <p className="text-[11px] text-eco-muted mt-1">
              PDF, PNG, JPG up to {maxSizeMb} MB
            </p>
          </label>
        </div>
      )}
      {error && <p className="text-xs text-eco-danger font-medium mt-1">{error}</p>}
    </div>
  );
};
