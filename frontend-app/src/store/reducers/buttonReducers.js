import * as actionTypes from '../actionTypes';

const initialState = {
  openDrawer: false,
  filesUpload: [],
};


const uploadFile = (state, action) => {
  const { files } = action.payload;
  return {
    ...state,
    filesUpload: [...state.filesUpload, files],
  };
};

const openDrawer = (state, action) => ({
  ...state,
  openDrawer: true,
});

const closeDrawer = (state, action) => ({
  ...state,
  openDrawer: false,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPENDRAWER: return openDrawer(state, action);
    case actionTypes.CLOSEDRAWER: return closeDrawer(state, action);
    case actionTypes.UPLOADFILE: return uploadFile(state, action);
    default: return state;
  }
};

export default reducer;