import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";

import Scream from "../components/Scream";

class Home extends Component {
  state = {
    screams: null
  };

  async componentDidMount() {
    try {
      const res = await axios.get("/screams");
      console.log(res.data);
      this.setState({
        screams: res.data
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
