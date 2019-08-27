import {DiscussionEmbed} from 'disqus-react';
import {graphql} from 'gatsby';
import React, {useMemo} from 'react';
import Layout from '../components/layout';
import Other from '../components/other';
import SEO from '../components/seo';
import style from './blog-post.module.scss';

export default function BlogPostTemplate({data, pageContext, location}) {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const {previous, next} = pageContext;

  const disqusConfig = useMemo(
    () => ({
      shortname: process.env.GATSBY_DISQUS_NAME,
      config: {identifier: post.fields.slug, title: siteTitle},
    }),
    [post.fields.slug, siteTitle],
  );

  return (
    <>
      <Layout location={location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.frontmatter.description || post.excerpt}
        />
        <h1 className="page-title">{post.frontmatter.title}</h1>
        <h5 className="page-title">
          {post.frontmatter.date} - {post.timeToRead} minute read
        </h5>
        <div dangerouslySetInnerHTML={{__html: post.html}} />
        <DiscussionEmbed {...disqusConfig} />
      </Layout>

      <footer className={style.footer}>
        <div className={style.thanks}>
          {'Thanks for reading! If you notice an issue, feel free to '}
          <a
            className="light"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://github.com/liamross/liamross.me/blob/master/content/blog${location.pathname}index.md`}
          >
            open a PR
          </a>
          {'.'}
        </div>
        <div className={style.nav}>
          <div className={style.navWrapper}>
            <Other other={previous} />
            <Other other={next} isNew />
          </div>
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
        social {
          github
        }
      }
    }
    markdownRemark(fields: {slug: {eq: $slug}}) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
      fields {
        slug
      }
    }
  }
`;
