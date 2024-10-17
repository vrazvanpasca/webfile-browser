import { useState } from "react";
import { FileNode } from "../App";

type TreeviewProps = {
  nodes: FileNode[];
  onFileClick: (file: FileNode) => void;
};

export const Treeview = ({ nodes, onFileClick }: TreeviewProps) => {
  return (
    <ul className='space-y-2'>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} onFileClick={onFileClick} />
      ))}
    </ul>
  );
};

type TreeNodeProps = {
  node: FileNode;
  onFileClick: (file: FileNode) => void;
};

const TreeNode = ({ node, onFileClick }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const [hovering, setHovering] = useState(false);

  const handleNodeClick = () => {
    if (node.type === "file") {
      onFileClick(node);
    } else {
      setExpanded(!expanded);
    }
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

        {/* Hover buttons */}
        {hovering && (
          <span>
            {node.type === "folder" && (
              <button className='text-green-500 mr-2'>+ Add</button>
            )}
            <button className='text-red-500'>Delete</button>
          </span>
        )}
      </div>
      {node.type === "folder" && expanded && node.children && (
        <ul className='ml-4'>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onFileClick={onFileClick} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Treeview;
