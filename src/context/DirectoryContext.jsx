import { createContext, useContext, useState } from "react";

const DirectoryContext = createContext()

export const useDirectoryContext = () => useContext(DirectoryContext)

export const DirectoryProvider = ({children, initialData}) => {
  const [rootNode, setRootNode] = useState(initialData)
  const [currentFile, setCurrentFile] = useState(null)

  return (
    <DirectoryContext.Provider value={{ rootNode, setRootNode, currentFile, setCurrentFile}}>
      {children}
    </DirectoryContext.Provider>
  )
}