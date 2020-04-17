import React, { useEffect } from "react";
import PropTypes from "prop-types";

import Scream from "../components/scream/Scream";
import Profile from "../components/profile/Profile";
import ScreamSkeleton from "../util/ScreamSkeleton";

// MUI Stuff
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import { getScreams } from "../redux/actions/dataActions";

const Home = ({ data: { screams, loading }, getScreams }) => {
  useEffect(() => {
    getScreams();
  }, [getScreams]);

  return (
    <Grid container spacing={10}>
      <Grid item sm={8} xs={12}>
        {!loading && screams ? (
          screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
        ) : (
          <ScreamSkeleton />
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

Home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

const mapActionsToProps = {
  getScreams
};

export default connect(mapStateToProps, mapActionsToProps)(Home);
