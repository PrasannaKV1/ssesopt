import './SnackbarTost.css'
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";

import { SnackbarEventActions } from "../redux/actions/snackbarEvent";
import { RootStore } from "../redux/store";

const SnackbarTost = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector((state: RootStore) => state?.snackBarEvent?.snackbarOpen);
  const snackbarType = useSelector((state: RootStore) => state?.snackBarEvent?.snackbarType);
  const snackbarMessage = useSelector((state: RootStore) => state?.snackBarEvent?.snackbarMessage);
  const isHtmlText = useSelector((state: RootStore) => state?.snackBarEvent?.isHtmlText);
  const handleClose = () => {
    dispatch(
        SnackbarEventActions({
        snackbarOpen: false,
        snackbarType: snackbarType,
        snackbarMessage: snackbarMessage,
      })
    );
  };
  return (
    <div className="snackbar_container">
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        data-testid="snackBar"
        className="snackbar_css"
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => handleClose()}
          color={snackbarType}
          data-testid="alertBox"
          style={snackbarType==="success"?{backgroundColor:"#2e7d32",color:"#fff"}:{}}
          severity={snackbarType}
          // style={{backgroundColor:`${snackbarType === "success" ? "#76B947":""}`}}
        >
          {isHtmlText ? (
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: snackbarMessage }} />
          ) : (
            snackbarMessage
          )}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarTost;