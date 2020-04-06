import React, { useState, useEffect } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Scream from "../components/Scream";
import Profile from "../components/Profile";

const Home = () => {
  const [screams, setScreams] = useState(null);

  useEffect(() => {
    const fetchScreams = async () => {
      try {
        const res = await axios.get("/screams");
        console.log(res.data);
        setScreams(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScreams();
  }, []);

  let recentScreamsMarkup = screams ? (
    screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
  ) : (
    <p>Loading...</p>
  );

  return (
    <Grid container spacing={10}>
      <Grid item sm={8} xs={12}>
        {recentScreamsMarkup}
      </Grid>
      <Grid item sm={4} xs={12}>
        <Profile />
      </Grid>
    </Grid>
  );
};

export default Home;
