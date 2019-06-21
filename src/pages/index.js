import {graphql} from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import List from '../components/list';
import SEO from '../components/seo';
import './index.scss';

export default function BlogIndex({data, location}) {
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} nonBlog>
      <SEO title="All posts" />
      <List posts={posts} />
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
