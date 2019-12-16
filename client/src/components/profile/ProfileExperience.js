import React from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExpererience = ({
  experience: { current, title, company, location, from, to, description }
}) => {
  return (
    <div>
      <h3 class="text-dark">{company}</h3>

      <p>
        <Moment format="YYYY/MM/DD">{from}</Moment> -{" "}
        {current ? "Now" : <Moment format="YYYY/MM/DD">{to}</Moment>}
      </p>
      <p>
        <strong>Position:</strong>
        {title}
      </p>
      <p>
        <strong>Location:</strong>
        {location}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  );
};

ProfileExpererience.propTypes = {
  experience: PropTypes.array.isRequired
};

export default ProfileExpererience;
