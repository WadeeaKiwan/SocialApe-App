import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Scream from "../components/scream/Scream";
import StaticProfile from "../components/profile/StaticProfile";

// Redux
import { connect } from "react-redux";
import { getUserScreams } from "../redux/actions/dataActions";

// MUI Stuff
import Grid from "@material-ui/core/Grid";

const User = ({
  data: { screams, loading },
  match: {
    params: { handle, screamId }
  },
  getUserScreams
}) => {
  const [profile, setProfile] = useState(null);
  const [screamIdParam, setScreamIdParam] = useState(null);

  useEffect(() => {
    if (screamId) setScreamIdParam(screamId);

    getUserScreams(handle);

    const getUserDetails = async () => {
      try {
        const res = await axios.get(`/user/${handle}`);

        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    getUserDetails();
  }, [getUserScreams, handle, screamId]);

  return (
    <Grid container spacing={10}>
      <Grid item sm={8} xs={12}>
        {loading ? (
          <p>Loading data...</p>
        ) : screams ? (
          !screamIdParam ? (
            screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
          ) : (
            screams.map((scream) => {
              if (scream.screamId !== screamIdParam) {
                return <Scream key={scream.screamId} scream={scream} />;
              } else {
                return <Scream key={scream.screamId} scream={scream} openDialog />;
              }
            })
          )
        ) : (
          <p>No screams from this user</p>
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        {profile ? <StaticProfile profile={profile} /> : <p>Loading profile...</p>}
      </Grid>
    </Grid>
  );
};

User.propTypes = {
  data: PropTypes.object.isRequired,
  getUserScreams: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

const mapActionsToProps = {
  getUserScreams
};

export default connect(mapStateToProps, mapActionsToProps)(User);
