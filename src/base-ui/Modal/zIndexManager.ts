const BASE_MODAL_Z_INDEX = 1000;

let top = BASE_MODAL_Z_INDEX;

export const acquireModalZIndex = () => {
  top += 10;
  return top;
};
