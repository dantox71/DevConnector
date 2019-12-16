import React from "react";
import { Link } from "react-router-dom";

const DashboardActions = props => {
  return (
    <div className="dash-buttons">
      <Link to="/edit-profile" className="btn">
        <i className="fa fa-user-circle text-primary"></i> Edit Profile
      </Link>
      <Link to="/add-experience" className="btn">
        <i className="fa fa-black-tie text-primary"></i> Add Eperience
      </Link>

      <Link to="/add-education" className="btn">
        <i className="fa fa-graduation-cap text-primary"></i> Add Education
      </Link>
    </div>
  );
};

DashboardActions.propTypes = {};

export default DashboardActions;
