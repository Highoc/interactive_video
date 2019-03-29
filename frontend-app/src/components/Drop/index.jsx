import React, { useState, useMemo } from 'react';
import { NativeTypes } from 'react-dnd-html5-backend';
import TargetBox from './Drop';
import FileList from './FileList';

const { FILE } = NativeTypes;
const Container = (props) => {
  const [droppedFiles, setDroppedFiles] = useState([]);
  const accepts = useMemo(() => [FILE], []);
  const handleFileDrop = (item, monitor) => {
    if (monitor) {
      setDroppedFiles(monitor.getItem().files);
      props.callback(monitor.getItem().files);
    }
  };
  return (
    <div>
      <TargetBox accepts={accepts} onDrop={handleFileDrop} />
      <FileList files={droppedFiles} />
    </div>
  );
};
export default Container;
