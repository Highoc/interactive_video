
import React from 'react';

function list(files) {
  const label = file => `'${file.name}' of size '${file.size}' and type '${file.type}'`;
  return files.map(file => <li key={file.name}>{label(file)}</li>);
}
const FileList = ({ files }) => (files.length === 0 ? (
  <div>Добавьте файл</div>
) : (
  <div>{list(files)}</div>
));
export default FileList;
