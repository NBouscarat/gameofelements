/* "use client";
import { useRef, forwardRef,useImperativeHandle } from 'react';
import type { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import { Editor } from "@tinymce/tinymce-react";

interface EditorClientProps {
  value: string;
}

const EditorClient = forwardRef(({ value }: EditorClientProps, ref) => {
    const editorRef =useRef<any>(null);
    const GetContent = () => {
        if (editorRef.current) {
            return editorRef.current.getContent();
        }
      };

    useImperativeHandle(ref, () => ({
        GetContent: () => editorRef.current.getContent(),
    }));
  return (
    <>
    <Editor

      apiKey='bcceb58mfl5fj31exakxhuicq3shq03729dv7rt3ygygw3t1'
      init={{
        height: 500,
        width: "100%",
        plugins: "lists link image media",
        toolbar:
          " bullist numlist | bold italic | link image media | outdent indent",
        skin: "oxide",
        menubar: false,
      }}
      initialValue={value}
      onInit={(_evt, editor) => (editorRef.current = editor)}
    />
    </>
  );
});
export default EditorClient;
 */