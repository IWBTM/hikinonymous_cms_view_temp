import React from "react";
import axios from "axios";

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, isAuthenticated: true };
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, {
    isAuthenticated: !!localStorage.getItem("Access-Token"),
  });

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError, setErrorMessage) {

  setError(false);
  setIsLoading(true);

  if (!!login && !!password) {
    // axios 로그인
    axios.post('http://localhost:8082/cms/login/proc', JSON.stringify({
      "email": login,
      "pwd": password
    }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      }
    })
      .then((data)=>{
        data = data.data;
        if (data.code == 200) {
          localStorage.setItem("Access-Token", data.data);
          dispatch({ type: "LOGIN_SUCCESS" });
          setError(null);
          setIsLoading(false);
          history.push("/app/dashboard");
        } else {
          setErrorMessage(data.message);
          setError(true);
        }
      })
      .catch((err)=>{
        console.log('err', err);
      });
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  localStorage.removeItem("Access-Token");
  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}
