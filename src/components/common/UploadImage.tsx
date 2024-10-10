import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Upload, UploadFile, UploadProps, Image, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';

interface UploadImageProps {
  fileList: UploadFile[];
  onChange: (fileList: UploadFile[]) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ fileList, onChange }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

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

  const handleRemove = (file: UploadFile) => {
    const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
    onChange(updatedFileList);
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
          showUploadList={{ showRemoveIcon: false }}
        >
          {fileList.length > 0 ? null : (
            <button style={{ border: 0, background: 'none' }} type='button'>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
      </ImgCrop>

      {fileList.length > 0 && (
        <Button
          type='text'
          icon={<DeleteOutlined style={{ color: 'red', fontSize: 20 }} />}
          onClick={() => handleRemove(fileList[0])}
          style={{ marginTop: 4, width: 102 }}
        >
          Xóa ảnh
        </Button>
      )}

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
