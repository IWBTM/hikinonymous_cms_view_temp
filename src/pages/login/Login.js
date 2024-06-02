import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";
import google from "../../images/google.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [errorMessage, setErrorMessage] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Hikinonymous Admin</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={0}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
          </Tabs>
          <React.Fragment>
            <Typography variant="h2" className={classes.greeting}>
              관리자님, 반갑습니다.
            </Typography>
            <Button size="large" className={classes.googleButton}>
              <img src={google} alt="google" className={classes.googleIcon} />
              &nbsp;Sign in with Google
            </Button>
            <div className={classes.formDividerContainer}>
              <div className={classes.formDivider} />
              <Typography className={classes.formDividerWord}>or</Typography>
              <div className={classes.formDivider} />
            </div>
            <Fade in={error}>
              <Typography color="secondary" className={classes.errorMessage}>
                { errorMessage }
              </Typography>
            </Fade>
            <TextField
              id="email"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={loginValue}
              onChange={e => setLoginValue(e.target.value)}
              margin="normal"
              placeholder="Email Adress"
              type="email"
              fullWidth
            />
            <TextField
              id="password"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                },
              }}
              value={passwordValue}
              onChange={e => setPasswordValue(e.target.value)}
              margin="normal"
              placeholder="Password"
              type="password"
              fullWidth
            />
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    loginValue.length === 0 || passwordValue.length === 0
                  }
                  onClick={() => {
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                        setErrorMessage
                      )
                    }
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Login
                </Button>
              )}
            </div>
          </React.Fragment>
        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2014-2019 Flatlogic, LLC. All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
