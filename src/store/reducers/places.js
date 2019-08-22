import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from '../actions/actionTypes';

const initialState = {
  places: [],
  placeAdded: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PLACES:
      return {
        ...state,
        places: action.places
      };

      /* 
      ADD_PLACE exist when we do not need to fetch API from backend

      case ADD_PLACE:
      return {
        ...state,
        places: state.places.concat({
          key: Math.random(),
          name: action.placeName,
          image: {
            uri:
              action.imageURI.uri,
          },
          location: action.location
        }),
      }; */
    
    case START_ADD_PLACE:
      return {
        ...state,
        placeAdded: false
      }

    case PLACE_ADDED:
      return {
        ...state,
        placeAdded: true
      }

    case REMOVE_PLACE:
      return {
        ...state,
        places: state.places.filter(place => {
          return place.key !== action.key;
        }),
      };
    
    default:
      return state;
  }
};

export default reducer;
