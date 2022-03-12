import axios from "axios";
import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = user => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    user
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  // localStorage.removeItem("user");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  // export const authLogin = (email, password) => {
  // console.log(email, password);
  // console.log("firing");
  return dispatch => {
    dispatch(authStart());
    axios
      .post(`${localhost}/rest-auth/login/`, {
        // email: email,
        username: username,
        password: password
      })
      .then(res => {
        // console.log(res.data);
        const user = {
          token: res.data.key,
          // username,
          userId: res.data.user,
          username: res.data.user_type.username,
          is_student: res.data.user_type.is_student,
          is_teacher: res.data.user_type.is_teacher
          // expirationDate: new Date(new Date().getTime() + 3600 * 1000)
        };
        // localStorage.setItem("user", JSON.stringify(user));
        // AsyncStorage.setItem("user", JSON.stringify(user));
        // saveUserToStorage(user);
        dispatch(authSuccess(user));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (
  username,
  email,
  password1,
  password2,
  is_student
) => {
  return dispatch => {
    dispatch(authStart());
    const user = {
      username,
      email,
      password1,
      password2,
      is_student: true,
      is_teacher: false
    };
    axios
      .post(`${localhost}/rest-auth/registration/`, user)
      .then(res => {
        const user = {
          token: res.data.key,
          username,
          userId: res.data.user,
          is_student: true,
          is_teacher: false
          // expirationDate: new Date(new Date().getTime() + 3600 * 1000)
        };
        // localStorage.setItem("user", JSON.stringify(user));
        dispatch(authSuccess(user));
        // dispatch(checkAuthTimeout(3600));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

// export const authCheckState = () => {
//   return dispatch => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     if (user === undefined || user === null) {
//       dispatch(logout());
//     } else {
//       const expirationDate = new Date(user.expirationDate);
//       if (expirationDate <= new Date()) {
//         dispatch(logout());
//       } else {
//         dispatch(authSuccess(user));
//         dispatch(
//           checkAuthTimeout(
//             (expirationDate.getTime() - new Date().getTime()) / 1000
//           )
//         );
//       }
//     }
//   };
// };
