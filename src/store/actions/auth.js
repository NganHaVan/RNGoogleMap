import { AsyncStorage } from "react-native";

import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "./index";
import startMainTab from "../../screens/MainTab/startMainTab";
import App from '../../../App';

const API_KEY = "AIzaSyC4yzP6CD6jp5C5564jI5Ns_Wyb8NpNoSs";

export const tryAuth = (authData, authMode) => {
  return (dispatch) => {
    dispatch(uiStartLoading());
    let url =
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
      API_KEY;
    if (authMode === "signup") {
      url =
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" +
        API_KEY;
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .catch((err) => {
        console.log("Error in signup: ", err);
        alert("Authentication failed: ", err);
        dispatch(uiStopLoading());
      })
      .then((res) => res.json())
      .then((parseRes) => {
        dispatch(uiStopLoading());
        console.log(parseRes);
        if (!parseRes.idToken) {
          alert("Authentication failed, please try again");
        } else {
          startMainTab();
          dispatch(
            authStoreToken(
              parseRes.idToken,
              parseRes.expiresIn,
              parseRes.refreshToken
            )
          );
        }
      });
  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return (dispatch) => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem("auth:token", token);
    // AsyncStorage accepts only String
    AsyncStorage.setItem("auth:expiryDate", expiryDate.toString());
    AsyncStorage.setItem("auth:refreshToken", refreshToken);
  };
};

export const authSetToken = (token, expiredDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiredDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem("auth:token")
          .then((tokenFromStorage) => {
            fetchedToken = tokenFromStorage;
            if (!tokenFromStorage) {
              reject();
              return;
            }
            return AsyncStorage.getItem("auth:expiryDate");
          })
          .then((expiryDate) => {
            // expiryDate is a String now
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            } else {
              reject();
            }
          })
          .catch((err) => reject());
      } else {
        resolve(token);
      }
    });
    return promise
      .catch((err) => {
        return AsyncStorage.getItem("auth:refreshToken").then(
          (refreshToken) => {
            return fetch(
              "https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
              {
                method: "POST",
                headers: {
                  "Content-Type": " application/x-www-form-urlencoded"
                },
                body: "grant_type=refresh_token&refresh_token=" + refreshToken
              }
            )
              .then((res) => res.json())
              .then((parsedRes) => {
                console.log("ParsedRes for refresh token: ", parsedRes);
                if (parsedRes.id_token) {
                  console.log("Your token has been refreshed");
                  dispatch(
                    authStoreToken(
                      parsedRes.id_token,
                      parsedRes.expires_in,
                      parsedRes.refresh_token
                    )
                  );
                  return parsedRes.id_token;
                } else {
                  dispatch(clearStorage());
                }
              })
              .catch((err) => console.log("Cannot fetch new token"));
          }
        );
      })
      .then((newToken) => {
        console.log(newToken);
        if (!newToken) {
          throw new Error();
        } else {
          return newToken;
        }
      });
  };
};

export const autoSignIn = () => {
  return (dispatch) => {
    dispatch(authGetToken())
      .then((token) => {
        startMainTab();
      })
      .catch((err) => console.log("Failed to fetch token!"));
  };
};

export const clearStorage = () => {
  return (dispatch) => {
    AsyncStorage.removeItem("auth:token");
    AsyncStorage.removeItem("auth:expiryDate");
    return AsyncStorage.removeItem("auth:refreshToken");
  };
};

export const authLogOut = () => {
  return dispatch => {
    dispatch(clearStorage())
    .then(() => {
      App();
    });
    dispatch(removeToken());
  }
}

export const removeToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
}