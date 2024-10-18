import React, { useState } from "react";
import FileViewer from "./components/FileViewer";
import Treeview from "./components/Treeview";

// Define the type for files and folders
export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

const initialData: FileNode[] = [
  {
    id: "1",
    name: "public",
    type: "folder",
    children: [{ id: "2", name: "logo.png", type: "file" }],
  },
  {
    id: "3",
    name: "server",
    type: "folder",
    children: [{ id: "4", name: "config.json", type: "file" }],
  },
  {
    id: "5",
    name: "src",
    type: "folder",
    children: [
      { id: "6", name: "App.txt", type: "file" },
      { id: "7", name: "File2.txt", type: "file" },
      {
        id: "8",
        name: "components",
        type: "folder",
        children: [{ id: "9", name: "Treeview.txt", type: "file" }],
      },
    ],
  },
];

export const App = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileData, setFileData] = useState<FileNode[]>(initialData);
  const [filterText, setFilterText] = useState("");

  const handleFileClick = (file: FileNode) => {
    setSelectedFile(file);
  };

  // // Function to add a file/folder to a specific folder
  // const handleAddNode = (folderId: string, isFile: boolean) => {
  //   const newId = Date.now().toString(); // Simple ID generation
  //   const newNode: FileNode = {
  //     id: newId,
  //     name: isFile ? `NewFile${newId}.txt` : `NewFolder${newId}`,
  //     type: isFile ? "file" : "folder",
  //     children: isFile ? undefined : [],
  //   };

  //   // Recursively add new node to the correct folder
  //   const addNode = (nodes: FileNode[]): FileNode[] => {
  //     return nodes.map((node) => {
  //       if (node.id === folderId && node.type === "folder") {
  //         return { ...node, children: [...(node.children || []), newNode] };
  //       } else if (node.children) {
  //         return { ...node, children: addNode(node.children) };
  //       }
  //       return node;
  //     });
  //   };

  //   setFileData(addNode(fileData));
  // };

  const handleAddNode = (
    folderId: string,
    fileType: "txt" | "json" | "png" | "folder"
  ) => {
    const newId = Date.now().toString(); // Simple ID generation
    const fileExtension = fileType !== "folder" ? `.${fileType}` : "";
    const newNode: FileNode = {
      id: newId,
      name:
        fileType === "folder"
          ? `NewFolder${newId}`
          : `NewFile${newId}${fileExtension}`,
      type: fileType === "folder" ? "folder" : "file",
      children: fileType === "folder" ? [] : undefined, // No children for files
    };

    // Recursively add the new node to the correct folder
    const addNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === folderId && node.type === "folder") {
          return { ...node, children: [...(node.children || []), newNode] };
        } else if (node.children) {
          return { ...node, children: addNode(node.children) };
        }
        return node;
      });
    };

    setFileData(addNode(fileData));
  };

  // Function to delete a file or folder
  const handleDeleteNode = (nodeId: string) => {
    const deleteNode = (nodes: FileNode[]): FileNode[] => {
      return nodes
        .filter((node) => node.id !== nodeId) // Filter out the node to delete
        .map((node) => {
          if (node.children) {
            return { ...node, children: deleteNode(node.children) };
          }
          return node;
        });
    };

    setFileData(deleteNode(fileData));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value);
  };

  const filteredData = filterTree(fileData, filterText);

  return (
    <div className='flex h-screen'>
      <div className='w-1/4 bg-gray-100 p-4 overflow-auto'>
        <input
          type='text'
          placeholder='Filter...'
          value={filterText}
          onChange={handleFilterChange}
          className='w-full p-2 mb-4'
        />
        <Treeview
          nodes={filteredData}
          onFileClick={handleFileClick}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
        />
      </div>

      <div className='w-3/4 bg-white p-4 overflow-auto'>
        {selectedFile ? (
          <FileViewer file={selectedFile} />
        ) : (
          <p>Select a file to view or edit</p>
        )}
      </div>
    </div>
  );
};

function filterTree(nodes: FileNode[], filter: string): FileNode[] {
  return nodes
    .filter(
      (node) =>
        node.name.toLowerCase().includes(filter.toLowerCase()) ||
        (node.children &&
          node.children.some((child) =>
            child.name.toLowerCase().includes(filter.toLowerCase())
          ))
    )
    .map((node) => ({
      ...node,
      children: node.children ? filterTree(node.children, filter) : undefined,
    }));
}
