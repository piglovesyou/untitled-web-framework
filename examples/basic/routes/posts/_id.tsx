import React, { useContext } from 'react';
import Layout from "../../components/Layout/Layout";
import {AppContext} from "uwf";

export const title = 'Posts';

const Home = () => {
  const context = useContext(AppContext);
  console.log(context);
  debugger;
  return (
      <Layout>
        <div>Detail</div>
      </Layout>
  );
};

export default Home;
