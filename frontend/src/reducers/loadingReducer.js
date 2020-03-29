const initialState = {
  isLoading: false,
  text: ""
};

export default function(state = initialState, action) {
  switch(action.type) {
    case 'LOADING':
      return {
        ...state,
        isLoading: true,
        text: action.payload
      };
    case 'LOADING_FINISHED':
      return {
        ...state,
        isLoading: false,
        text: ""
      }
    default:
      return state;
  }
};
