import React, { useState, useEffect } from "react";
import { FileNode } from "../App";

type FileViewerProps = {
  file: FileNode;
};

const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const isImage = file.name.endsWith(".png");
  const isTextFile = file.name.endsWith(".txt") || file.name.endsWith(".json");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (isTextFile && !fileContents[file.id]) {
      setFileContents((prevContents) => ({
        ...prevContents,
        [file.id]: "Sample content for " + file.name,
      }));
    }
  }, [file, isTextFile, fileContents]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedContent = e.target.value;
    setFileContents((prevContents) => ({
      ...prevContents,
      [file.id]: updatedContent,
    }));
  };

  if (isTextFile) {
    return (
      <div>
        {isEditing ? (
          <textarea
            className='w-full h-64 p-2 border'
            value={fileContents[file.id] || ""}
            onChange={handleContentChange}
          />
        ) : (
          <pre className='whitespace-pre-wrap'>
            {fileContents[file.id] || "File content goes here"}
          </pre>
        )}
        <button
          className='mt-2 px-4 py-2 bg-blue-500 text-white'
          onClick={handleEditClick}
        >
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
    );
  }

  if (isImage) {
    return (
      <div>
        <div>
          <h3>{file.name}</h3>
          <img
            src={`/${file.name}`}
            alt={file.name}
            className='max-w-full h-auto'
          />
        </div>
      </div>
    );
  }

  return <p>Unsupported file type</p>;
};

export default FileViewer;
