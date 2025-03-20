import React from 'react'
import { useDirectoryContext } from '../context/DirectoryContext'

const ShowCurrentFile = () => {
  const { currentFile } = useDirectoryContext()
  
  return (
    <div>{currentFile}</div>
  )
}

export default ShowCurrentFile