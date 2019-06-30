import React, { useContext } from "react";
import AppContext from "uwf/AppContext";
import Layout from "../../components/Layout/Layout";

export const title = "Posts";

const Home = () => {
  const context = useContext(AppContext);
  console.log(context);
  return (
    <Layout>
      <div>Detail</div>
    </Layout>
  );
};

export default Home;
