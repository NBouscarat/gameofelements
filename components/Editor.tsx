'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
  getContent: () => string;
};

interface RichTextEditorProps {
  value: string;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>((props, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const toolbarOptions = [
    [{ 'color': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ 'indent': '-1'}, { 'indent': '+1' }], 
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'], 
    ];

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      // Create Quill instance only once
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
        },
      });
    }
    // Update the content when props.value changes
    if (quillRef.current) {
      const content = props.value || '';
      const delta = quillRef.current.clipboard.convert({ html: content });
      quillRef.current.setContents(delta);
    }
    

    return () => {
      // Cleanup to avoid memory leaks
      if (quillRef.current) {
        const toolbar = editorRef.current?.querySelector('.ql-toolbar');
        if (toolbar) {
          toolbar.remove(); // Remove the toolbar from the DOM
        }
        quillRef.current = null; // Clear the Quill instance
      }
    };
  }, [props.value]);

  // Expose the getContent function to the parent component
  useImperativeHandle(ref, () => ({
    getContent: () => {
      if (quillRef.current) {
        return quillRef.current.root.innerHTML; // Return the HTML content
      }
      return '';
    },
    
  }));

  return <div ref={editorRef} style={{ height: '300px' }} />;
});

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;