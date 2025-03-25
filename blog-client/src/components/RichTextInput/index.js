import { Editor } from "@tinymce/tinymce-react";
import { plugins, toolbars } from "./constant.js";

const RichTextInput = ({ value, setContent, setValue }) => {
  const onEditorInputChange = (newValue, editor) => {
    setValue(newValue);
    setContent(editor.getContent({ format: "text" }));
  };

  return (
    <>
      <Editor
        apiKey={"wp41uzw85urgc18i7if054tglm7vexsh79cytuozuteoske0"}
        onEditorChange={(newValue, editor) =>
          onEditorInputChange(newValue, editor)
        }
        onInit={(_, editor) =>
          setContent(editor.getContent({ format: "text" }))
        }
        value={value}
        initialValue={"Write your thoughts here..."}
        init={{
          height: 300,
          menubar: false, // 👈 hides the File/Edit/View menu bar
          plugins: plugins,
          toolbar: toolbars,
        }}
      />
    </>
  );
};

export default RichTextInput;
