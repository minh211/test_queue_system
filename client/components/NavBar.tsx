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
    <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
      <h5 className="my-0 mr-md-auto font-weight-normal text-info">HospitalQ</h5>
      <nav className="my-2 my-md-0 mr-md-3">
        {accessToken ? (
          <>
            <Link className={(activeTab === "/" && "p-2 text-info") || "p-2 text-dark"} to="/">
              Home
            </Link>
            <Link className={(activeTab === "/queue" && "p-2 text-info") || "p-2 text-dark"} to="/queue">
              Queue
            </Link>
            <Link className={(activeTab === "/doctors" && "p-2 text-info") || "p-2 text-dark"} to="/doctors">
              Doctors
            </Link>
          </>
        ) : null}
      </nav>
      <Link className="btn btn-outline-info" to={accessToken ? "/" : "/signIn"} onClick={signOut}>
        {accessToken ? "Sign Out" : "Sign In"}
      </Link>
    </div>
  );
};
export const NavBar = withRouter(_NavBar);
