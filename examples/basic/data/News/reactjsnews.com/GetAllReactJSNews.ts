import fetch from 'node-fetch';

import { ReactJsNewsItem } from 'uwf/dataBinders';

export const schema = `
  type ReactJSNewsItem {
    # The news item's title
    title: String!

    # A direct link URL to this news item on reactjsnews.com
    link: String!

    # The name of the news item's author
    author: String!

    # The date this news item was published
    pubDate: String!

    # News article in HTML format
    content: String!
  }
  
  # Retrieves the latest ReactJS News
  extend type Query {
    reactjsGetAllNews: [ReactJSNewsItem!]!
  }
`;

// React.js News Feed (RSS)
const url =
  'https://api.rss2json.com/v1/api.json' +
  '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml';

let items: ReactJsNewsItem[] = [];
let lastFetchTask: Promise<ReactJsNewsItem[]> | null;
let lastFetchTime = Number(new Date(1970, 0, 1));

export const resolvers = {
  Query: {
    reactjsGetAllNews() {
      if (lastFetchTask) {
        return lastFetchTask;
      }

      if (Date.now() - lastFetchTime > 1000 * 60 * 10 /* 10 mins */) {
        lastFetchTime = Date.now();
        lastFetchTask = fetch(url)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'ok') {
              items = data.items;
            }

            lastFetchTask = null;
            return items;
          })
          .catch(err => {
            lastFetchTask = null;
            throw err;
          });

        if (items.length) {
          return items;
        }

        return lastFetchTask;
      }

      return items;
    },
  },
};
