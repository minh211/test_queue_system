import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import { AppContext } from "../AppContainer";

const _NavBar: React.FC<RouteComponentProps> = (props) => {
  const activeTab = props.location.pathname;
  const {
    accessToken,
    eventHandlers: { signOut },
  } = React.useContext(AppContext);

  return (
    <nav className="aui-header" role="navigation">
      <div className="aui-header-primary">
        <span id="logo" className="aui-header-logo aui-header-logo-textonly">
          <Link to="/">HospitalQ</Link>
        </span>
      </div>
      <div className="aui-header-secondary" style={{ top: 0, bottom: 0 }}>
        <ul className="aui-nav">
          <li>
            <Link style={activeTab === "/" ? { backgroundColor: "hsl(218, 76%, 15%, 48%)" } : undefined} to="/">
              Home
            </Link>
          </li>
          {accessToken && (
            <li>
              <Link
                style={activeTab === "/queue" ? { backgroundColor: "hsla(218, 76%, 15%, 48%)" } : undefined}
                to="/queue">
                Queue
              </Link>
            </li>
          )}
          {accessToken && (
            <li>
              <Link
                style={activeTab === "/doctors" ? { backgroundColor: "hsl(218, 76%, 15%, 48%)" } : undefined}
                to="/doctors">
                Doctors
              </Link>
            </li>
          )}
          <li>
            <Link
              style={{ backgroundColor: "hsl(216, 100%, 40%)" }}
              to={accessToken ? "/" : "/signIn"}
              onClick={signOut}>
              {accessToken ? "Sign Out" : "Sign In"}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export const NavBar = withRouter(_NavBar);
