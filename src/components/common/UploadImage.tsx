import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload, UploadFile, UploadProps, Image, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useEffect, useState } from 'react';

interface UploadImageProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
  avatarImage?: any;
}

const UploadImage: React.FC<UploadImageProps> = ({
  fileList,
  onChange,
  avatarImage,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

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
