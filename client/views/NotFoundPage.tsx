import * as React from "react";

export const NotFoundPage: React.FC<PageNotFoundProps> = ({ history }) => {
  return (
    <div className="container">
      <h2>:( Page you are looking for doesn&apos;t exists.</h2>
      <br />
      <button className="btn btn-primary" onClick={history.goBack} type="button">
        Go back
      </button>
    </div>
  );
};

type PageNotFoundProps = {
  history: {
    goBack: () => void;
  };
};
