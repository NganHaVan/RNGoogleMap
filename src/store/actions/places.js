import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';

import {
  uiStartLoading,
  uiStopLoading,
  authGetToken
} from './index';

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  }
}

export const addPlace = (placeName, location, image) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let authToken;
    dispatch(authGetToken())
    .catch(() => alert('You are not allowed to add place!'))
    .then(token => {
      authToken = token;
      return fetch('https://us-central1-mapapi-1505734670610.cloudfunctions.net/storeImage', {
      method: 'POST',
      body: JSON.stringify({
        image: image.base64
      }),
      headers: {
        "Authorization" : "Bearer "+authToken
      }
    });
  })
      .then(res => res.json())
      .then(data => {
        const placeData = {
          name: placeName,
          location: location,
          image: data.imageUrl,
          imagePath: data.imagePath
        };
        return fetch('https://mapapi-1505734670610.firebaseio.com/places.json?auth='+authToken, {
            method: 'POST',
            body: JSON.stringify(placeData)
          })
          .then(res => res.json())
          .then(result => {
            // console.log(result);
            dispatch(getPlaces());
            dispatch(uiStopLoading());
            dispatch(placeAdded());
          })
          .catch(err => {
            // console.log(err);
            alert('Error: ', err);
            console.log(err);
            dispatch(uiStopLoading());
          });
      })
      .catch(err => {
        // console.log(err);
        alert('Error: ', err)
        console.log(err);
        dispatch(uiStopLoading());
      });
  };
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  }
}

export const getPlaces = () => {
  return dispatch => {
    // authGetToken return a Promise
    dispatch(authGetToken())
    .then(token => {
        return fetch('https://mapapi-1505734670610.firebaseio.com/places.json?auth='+token)
      })
    .catch(() => alert('Permission denied'))
    .then(res => res.json())
    .then(data => {
      // console.log('Check data for get: ', data);
      const places = [];
      for (const key in data) {
        // console.log('Check keys (is it coded key?)',key);
        places.push({
          ...data[key],
          image: {uri: data[key].image},
          key: key
        })
      }
      dispatch(setPlaces(places));
    })
    .catch(err=> {
      alert('Error: ', err);
      console.log(err);
    });
  }
}

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  }
}

export const deletePlace = key => {
  return dispatch => {
    dispatch(authGetToken())
    .catch(() => alert('You have no rights to delete this place!'))
    .then(token => {
      dispatch(removePlace(key));
      return fetch('https://mapapi-1505734670610.firebaseio.com/places/'+key+'.json?auth='+token, {
        method: 'DELETE'
      });
    })
    .then(res => res.json())
    .then(data => {
      console.log('Delete successfully');
    })
    .catch(err => {
      alert('Error: ',err);
      console.log(err);
    })
  }
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key: key
  }
}