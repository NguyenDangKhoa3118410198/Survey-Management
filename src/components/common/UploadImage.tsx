import { PlusOutlined } from '@ant-design/icons';
import { Upload, UploadFile, UploadProps, Image, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useRef, useState } from 'react';
import type { RcFile } from 'antd/es/upload/interface';

interface UploadImageProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  avatarImage?: any;
}

const UploadImage: React.FC<UploadImageProps> = ({ fileList, onChange, avatarImage }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const uploadInputRef = useRef<HTMLInputElement | null>(null); // Ref cho input file ẩn

  useEffect(() => {
    if (avatarImage) {
      onChange([
        {
          uid: '-1',
          name: 'initial.png',
          status: 'done',
          url: avatarImage,
          thumbUrl: avatarImage,
        },
      ]);
    }
  }, [avatarImage]);

  type FileType = Exclude<UploadFile['originFileObj'], undefined>;

  const handleChange: UploadProps['onChange'] = (info) => {
    onChange(info.fileList);
  };

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      const rcFile: RcFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      }) as RcFile;

      rcFile.uid = Date.now().toString();

      const uploadFile: UploadFile = {
        uid: rcFile.uid,
        name: rcFile.name,
        status: 'uploading',
        originFileObj: rcFile,
        url: URL.createObjectURL(rcFile),
      };

      onChange([uploadFile]);

      try {
        const formData = new FormData();
        formData.append('file', rcFile);

        const response = await fetch(
          'https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (response.ok) {
          const result = await response.json();

          const serverFileUrl = result.physicalPath;

          const uploadedFile: UploadFile = {
            uid: rcFile.uid,
            name: rcFile.name,
            status: 'done',
            originFileObj: rcFile,
            url: serverFileUrl,
          };

          onChange([uploadedFile]);
        } else {
          console.error('Upload failed');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <>
      <ImgCrop rotationSlider>
        <Upload
          action='https://api-dev.estuary.solutions:8443/fico-salex-mediafile-dev/files/upload'
          listType='picture-card'
          fileList={fileList}
          onChange={handleChange}
          maxCount={1}
          onPreview={handlePreview}
        >
          {fileList.length > 0 ? null : (
            <button style={{ border: 0, background: 'none' }} type='button'>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
      </ImgCrop>

      <Button onClick={() => uploadInputRef.current?.click()} style={{ marginTop: 10 }}>
        Change Image
      </Button>

      <input
        type='file'
        ref={uploadInputRef}
        style={{ display: 'none' }}
        accept='image/*'
        onChange={handleFileInputChange}
      />

      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default UploadImage;
