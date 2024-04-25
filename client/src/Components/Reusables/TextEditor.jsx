import React, { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
/* import "@tinymce/tinymce-react/dist/main/css/main.min.css";
 */
const TextEditor = ({ closeEditor, onChange = () => {} }) => {
  const [editorContent, setEditorContent] = useState("");
  const handleEditorChange = (content, editor) => {
    setEditorContent(content);
  };
  useEffect(() => {
    onChange(editorContent);
  }, [editorContent]);
  return (
    <div className="dptext-editor-cnt">
      <Editor
        apiKey="w29gpcom19jht1ugyu6hw7xpqe77gz07emkrg6g6hoxd7o43" // Replace with your TinyMCE API key (optional)
        initialValue="Type something here..."
        onInit={(evt, editor) => editor.setContent(editorContent)}
        onEditorChange={handleEditorChange}
        init={{
          height: 700,
          plugins:
            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker markdown",
          toolbar:
            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | align lineheight | numlist bullist indent outdent | emoticons charmap | image | removeformat", // Added 'image' to the toolbar
        }}
      />
    </div>
  );
};

export default TextEditor;
