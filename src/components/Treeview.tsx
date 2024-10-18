import React, { useState } from "react";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

type TreeviewProps = {
  nodes: FileNode[];
  onFileClick: (file: FileNode) => void;
  onAddNode: (
    folderId: string,
    fileType: "txt" | "json" | "png" | "folder"
  ) => void;
  onDeleteNode: (nodeId: string) => void;
};

export const Treeview = ({
  nodes,
  onFileClick,
  onAddNode,
  onDeleteNode,
}: TreeviewProps) => {
  return (
    <ul className='space-y-2'>
      {nodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onFileClick={onFileClick}
          onAddNode={onAddNode}
          onDeleteNode={onDeleteNode}
        />
      ))}
    </ul>
  );
};

type TreeNodeProps = {
  node: FileNode;
  onFileClick: (file: FileNode) => void;
  onAddNode: (
    folderId: string,
    fileType: "txt" | "json" | "png" | "folder"
  ) => void;
  onDeleteNode: (nodeId: string) => void;
};

const TreeNode = ({
  node,
  onFileClick,
  onAddNode,
  onDeleteNode,
}: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [addingFile, setAddingFile] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<
    "txt" | "json" | "png"
  >("txt");

  const handleNodeClick = () => {
    if (node.type === "file") {
      onFileClick(node);
    } else {
      setExpanded(!expanded);
    }
  };

  const handleAddFile = () => {
    setAddingFile(true);
  };

  const handleAddFolder = () => {
    onAddNode(node.id, "folder"); // Add a folder
  };

  const handleAddFileType = () => {
    onAddNode(node.id, selectedFileType); // Add the selected file type
    setAddingFile(false); // Hide the dropdown after adding the file
  };

  const handleDelete = () => {
    onDeleteNode(node.id); // Delete the current node
  };

  return (
    <li
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className={`cursor-pointer flex justify-between ${
          node.type === "file" ? "text-blue-500" : ""
        }`}
        onClick={handleNodeClick}
      >
        <span>
          {node.type === "folder" && <span>{expanded ? "📂" : "📁"} </span>}
          {node.name}
        </span>

        {hovering && (
          <span>
            {node.type === "folder" && (
              <>
                <button className='text-green-500 mr-2' onClick={handleAddFile}>
                  + File
                </button>
                <button
                  className='text-green-500 mr-2'
                  onClick={handleAddFolder}
                >
                  + Folder
                </button>
              </>
            )}
            <button className='text-red-500' onClick={handleDelete}>
              Delete
            </button>
          </span>
        )}
      </div>

      {node.type === "folder" && expanded && node.children && (
        <ul className='ml-4'>
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onFileClick={onFileClick}
              onAddNode={onAddNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </ul>
      )}

      {addingFile && (
        <div className='ml-4 mt-2'>
          <select
            value={selectedFileType}
            onChange={(e) =>
              setSelectedFileType(e.target.value as "txt" | "json" | "png")
            }
            className='p-2 border border-gray-300 rounded'
          >
            <option value='txt'>Text (.txt)</option>
            <option value='json'>JSON (.json)</option>
            <option value='png'>Image (.png)</option>
          </select>
          <button
            onClick={handleAddFileType}
            className='ml-2 px-4 py-2 bg-green-500 text-white rounded'
          >
            Add File
          </button>
        </div>
      )}
    </li>
  );
};

export default Treeview;
