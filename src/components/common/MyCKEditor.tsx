import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={
        {
          placeholder: placeholder,
          ckfinder: {
            uploadUrl:
              'https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload',
          },
          toolbar: [
            'undo',
            'redo',
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'imageUpload',
            'insertTable',
            'mediaEmbed',
          ],
        } as any
      }
      onReady={(editor) => {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
          return {
            upload: () => {
              return new Promise((resolve, reject) => {
                const formData = new FormData();
                loader.file.then((file) => {
                  if (file) {
                    formData.append('file', file);
                  } else {
                    reject('No file selected');
                    return;
                  }

                  fetch(
                    'https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload',
                    {
                      method: 'POST',
                      body: formData,
                      headers: {},
                    }
                  )
                    .then((response) => {
                      if (!response.ok) {
                        reject('Upload failed');
                      }
                      return response.json();
                    })
                    .then((data) => {
                      resolve({
                        default: data.physicalPath,
                      });
                    })
                    .catch((error) => {
                      reject(error);
                    });
                });
              });
            },
          };
        };
      }}
    />
  );
};

export default TextEditor;
