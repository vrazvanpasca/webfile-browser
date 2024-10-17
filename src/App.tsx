import { useState } from "react";
import FileViewer from "./components/FileViewer";
import Treeview from "./components/Treeview";

// Define the type for files and folders
export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
};

const initialData: any[] = [
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
        <Treeview nodes={filteredData} onFileClick={handleFileClick} />
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
