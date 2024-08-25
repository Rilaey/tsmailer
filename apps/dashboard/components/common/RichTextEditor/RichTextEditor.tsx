import React, { useState } from 'react'
import { Paper } from '@mantine/core'
import dynamic from 'next/dynamic'
import { EditorState, ContentState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// Dynamically import Editor to avoid SSR issues
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
)

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(ContentState.createFromText(content)),
  )

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState)
    const currentContent = newEditorState.getCurrentContent()
    onChange(currentContent.getPlainText())
  }

  return (
    <Paper mih={500} px="xs">
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </Paper>
  )
}

export default RichTextEditor
