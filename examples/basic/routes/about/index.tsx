import React from 'react';
import Layout from '../../components/Layout/Layout';
import Page from '../../components/Page/Page';
import md from './index.md';

export const title = 'About';

const About = () => (
  <Layout>
    <Page {...md} />
  </Layout>
);

export default About;
