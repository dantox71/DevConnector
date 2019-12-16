import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
  //Generate random ID
  const id = uuid.v4();

  const alert = { msg, alertType, id };

  dispatch({
    type: SET_ALERT,
    payload: alert
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      }),
    timeout
  );
};
