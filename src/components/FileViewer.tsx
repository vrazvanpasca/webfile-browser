import { useState } from "react";
import { FileNode } from "../App";

type FileViewerProps = {
  file: FileNode;
};

const FileViewer = ({ file }: FileViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fileContent, setFileContent] = useState("");

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  if (file.name.endsWith(".png")) {
    return <img src={`/${file.name}`} alt={file.name} />;
  }

  if (file.name.endsWith(".txt") || file.name.endsWith(".json")) {
    return (
      <div>
        {isEditing ? (
          <textarea
            className='w-full h-64 p-2 border'
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          />
        ) : (
          <pre className='whitespace-pre-wrap'>
            {fileContent || "File content goes here"}
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

  return <p>Unsupported file type</p>;
};

export default FileViewer;
