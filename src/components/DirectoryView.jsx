import FolderIcon from '@mui/icons-material/Folder';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useState } from 'react';
import { useDirectoryContext } from '../context/DirectoryContext';
import { v4 as uuid } from 'uuid';

const DirectoryView = ({ node }) => {
  const { rootNode, setRootNode, setCurrentFile } = useDirectoryContext()
  const currentNode = node || rootNode
  const [isExpanded, setIsExpanded] = useState(false)
  const [showFolderInput, setShowFolderInput] = useState(false)
  const [folderInput, setFolderInput] = useState('')
  const [showFileInput, setShowFileInput] = useState(false)
  const [fileInput, setFileInput] = useState('')
  const [showRenameInput, setShowRenameInput] = useState(false)
  const [renameInput, setRenameInput] = useState('')
  const [showRenameFileInput, setShowRenameFileInput] = useState(false)
  const [renameFileInput, setRenameFileInput] = useState('')
  
  const handleCreateFunc = (type, name) => {
    setRootNode(prevNode => handleCreate(prevNode, currentNode.id, { id: uuid(), name: name, type: type }))
    if(type == 'folder') {
      setShowFolderInput(false)
      setFolderInput('')
    }else {
      setShowFileInput(false)
      setFileInput('')
    }
  }

  const handleCreate = (current, targetParentId, newNode) => {
    if(current.type == 'file') return current

    if(current.id == targetParentId) {
      return { ...current, nodes: [ ...(current.nodes || []), newNode]}
    }

    if(current.nodes) {
      return { ...currentNode, nodes: current.nodes.map((node) => handleCreate(node, targetParentId, newNode))}
    }

    return current
  }

  const handleDeleteFunc = () => {
    setRootNode(prevNode => handleDelete(prevNode, currentNode.id))
  }

  const handleDelete = (current, targetId) => {
    if(!current.nodes) return current;

    return { ...current, nodes: current.nodes.filter(node => node.id !== targetId).map(node => handleDelete(node, targetId))}
  }

  const handleRenameClick = (type = 'folder', node = currentNode) => {
    if(type == 'file') {
      setShowRenameFileInput(!showRenameFileInput)
      setRenameFileInput(node.name)
    }else {
      setShowRenameInput(!showRenameInput)
      setRenameInput(currentNode.name)
    }
  }

  const handleRenameFunc = (newName, type = 'folder') => {
    setRootNode(prevNode => handleRename(prevNode, currentNode.id, newName))
    if(type == 'file') {
      setShowRenameFileInput(false)
      setRenameFileInput('')
    }else {
      setShowRenameInput(false)
      setRenameInput('')
    }
  }

  const handleRename = (current, targetId, newName) => {
    if(current.id === targetId){
      return { ...current, name: newName }
    }

    if(current.nodes) {
      return { ...current, nodes: current.nodes.map(node => handleRename(node, targetId, newName))}
    }

    return current
  }

  const File = ({node}) => {
    return (
      <div className='ml-4'>
        <span><InsertDriveFileIcon /></span>
        <span>
          {
            showRenameFileInput ?
              <input className='border-1' value={renameFileInput} onChange={(e) => setRenameFileInput(e.target.value)} onKeyDown={(e) => {e.key == 'Enter' && handleRenameFunc(renameFileInput, 'file')}} />
              :
              node.name
          }
        </span>
        <span onClick={() => handleRenameClick('file')}><DriveFileRenameOutlineIcon /></span>
        <span onClick={() => setCurrentFile(node.name)}><FileOpenIcon /></span>
        <span onClick={() => handleDeleteFunc()}><DeleteIcon /></span>
      </div>
    )
  }

  if(currentNode.type == 'file') {
    return (
      <File node={currentNode} />
    )
  }

  return (
    <div className="ml-4">
      <span onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</span>
      <span><FolderIcon/></span>
      <span>
        {
          showRenameInput ?
            <input className='border-1' value={renameInput} onChange={(e) => setRenameInput(e.target.value)} onKeyDown={(e) => {e.key == 'Enter' && handleRenameFunc(renameInput)}} />
            :
            currentNode.name
        }
      </span>
      <span onClick={() => setShowFolderInput(!showFolderInput)}><CreateNewFolderIcon /></span>
      <span onClick={() => setShowFileInput(!showFileInput)}><NoteAddIcon /></span>
      <span onClick={() => handleDeleteFunc()}><DeleteIcon /></span>
      <span onClick={() => handleRenameClick()}><DriveFileRenameOutlineIcon /></span>
      <div>
        {
          showFolderInput && 
            <input className='border-1' value={folderInput} onChange={(e) => setFolderInput(e.target.value)} onKeyDown={(e) => {e.key == 'Enter' && handleCreateFunc('folder', folderInput)}} />
        }
      </div>
      <div>
        {
          showFileInput && 
            <input className='border-1' value={fileInput} onChange={(e) => setFileInput(e.target.value)} onKeyDown={(e) => {e.key == 'Enter' && handleCreateFunc('file', fileInput)}} />
        }
      </div>
      {isExpanded && currentNode.nodes?.map((node) => (
          <DirectoryView node={node} />
        ))
      }
    </div>
  )
}

export default DirectoryView