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

const User = ({ data: { screams, loading }, match, getUserScreams }) => {
  const [profile, setProfile] = useState(null);
  const { handle } = match.params;

  useEffect(() => {
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
  }, [getUserScreams, handle]);

  return (
    <Grid container spacing={10}>
      <Grid item sm={8} xs={12}>
        {!loading ? (
          screams ? (
            screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
          ) : (
            <p>No screams from this user</p>
          )
        ) : (
          <p>Loading data...</p>
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
