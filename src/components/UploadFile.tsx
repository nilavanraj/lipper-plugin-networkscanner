import React from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadFile = ({onSubmit}) => {
  const handleBeforeUpload = (file) => {
    const reader = new FileReader();

    // When the file is read successfully, this event will be triggered
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const jsonData = JSON.parse(content);
        onSubmit(jsonData);
       // console.log('JSON data:', jsonData);
      } catch (error) {
        console.error('Error reading JSON file:', error);
      }
    };

    // Read the file as text
    reader.readAsText(file);

    // Prevent the file from being uploaded (since we only need to read it)
    return false;
  };

  const props = {
    beforeUpload: handleBeforeUpload,
    accept: '.json',
  };

  return (
    <div>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Select JSON File</Button>
      </Upload>
    </div>
  );
};

export default UploadFile;
