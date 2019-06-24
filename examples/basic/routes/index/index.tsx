import React from 'react';
import {withStyles} from 'uwf';
import { withHomeNews } from "uwf/dataBinders";
import Layout from "../../components/Layout/Layout";
import s from './index.css';

export const title = 'Top page';

const Home = withHomeNews<{}>()(props => {
  const {
    reactjsGetAllNews,
    networkStatus: { isConnected },
    loading,
  } = props.data!;

  return (
      <Layout>
        <div className={ s.root }>
          <div className={ s.container }>
            <p className={ s.networkStatusMessage }>
              { isConnected ? 'Online' : 'Offline' }
            </p>
            <h1>React.js News</h1>
            { loading || !reactjsGetAllNews
                ? 'Loading...'
                : reactjsGetAllNews.map(item => (
                    <article key={ item.link } className={ s.newsItem }>
                      <h1 className={ s.newsTitle }>
                        <a href={ item.link }>{ item.title }</a>
                      </h1>
                      <div
                          className={ s.newsDesc }
                          // eslint-disable-next-line react/no-danger
                          dangerouslySetInnerHTML={ { __html: item.content } }
                      />
                    </article>
                )) }
          </div>
        </div>
      </Layout>
  );
});

export default withStyles(s)(Home);
