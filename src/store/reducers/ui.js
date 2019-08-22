import {
  UI_START_LOADING,
  UI_STOP_LOADING
} from '../actions/actionTypes';

const initialState = {
  isLoading: false
}

const reducer = (state = initialState, actions) => {
  switch (actions.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      }
    default:
      return state;
  }
}

export default reducer;