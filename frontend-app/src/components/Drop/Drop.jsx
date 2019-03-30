import React from 'react';
import { DropTarget } from 'react-dnd';
import classes from './Drop.module.css';

const TargetBox = ({ canDrop, isOver, connectDropTarget }) => {
  const isActive = canDrop && isOver;
  return connectDropTarget(
    <div className={classes.default}>{isActive ? 'Release to drop' : 'Переместите файлы сюда'}</div>,
  );
};
export default DropTarget(
  props => props.accepts,
  {
    drop(props, monitor) {
      if (props.onDrop) {
        props.onDrop(props, monitor);
      }
    },
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  }),
)(TargetBox);
