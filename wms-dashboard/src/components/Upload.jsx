// src/components/Upload.jsx
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { useCallback } from "react";

export default function Upload({ onDataLoaded }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onDataLoaded(results.data); // send parsed CSV data to parent
        },
      });
    },
    [onDataLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-blue-400 bg-blue-50 text-blue-700 p-6 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-all"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-lg font-medium">📥 Drop the file here...</p>
      ) : (
        <p className="text-lg font-medium">
          📎 Drag & drop or click to upload your CSV
        </p>
      )}
    </div>
  );
}
