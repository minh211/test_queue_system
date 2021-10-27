import * as React from "react";

import { AppContext } from "../AppContainer";

export const SignInPage = () => {
  const {
    authenticateError,
    eventHandlers: { signIn },
  } = React.useContext(AppContext);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmit = React.useCallback(async () => {
    await signIn(username, password);
  }, [password, signIn, username]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-4">
          <form className="d-flex flex-column">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                User Name
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-primary" disabled={!username || !password} onClick={onSubmit}>
              Login
            </button>
            {authenticateError && (
              <div className="alert alert-danger" role="alert">
                {authenticateError}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
