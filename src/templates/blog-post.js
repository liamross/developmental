import {graphql} from 'gatsby';
import React from 'react';
import Layout from '../components/layout';
import Other from '../components/other';
import SEO from '../components/seo';
import style from './blog-post.module.scss';

export default function BlogPostTemplate({data, pageContext, location}) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const {previous, next} = pageContext;

  return (
    <>
      <Layout location={location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <h1 className="page-title">{post.frontmatter.title}</h1>
        <h6 className="page-title">{post.frontmatter.date}</h6>
        <div dangerouslySetInnerHTML={{__html: post.html}} />
      </Layout>

      <footer className={style.footer}>
        <div className={style.footerWrapper}>
          <Other other={previous} />
          <Other other={next} isNew />
        </div>
      </footer>
    </>
  );
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: {slug: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
  }
`;
