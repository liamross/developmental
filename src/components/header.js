import {graphql, useStaticQuery, Link} from 'gatsby';
import Image from 'gatsby-image';
import React from 'react';
import style from './header.module.scss';
import GitHub from './github';

export default function Header() {
  const {avatar, site} = useStaticQuery(
    graphql`
      query HeaderQuery {
        avatar: file(absolutePath: {regex: "/liam.png/"}) {
          childImageSharp {
            fixed(width: 50, height: 50) {
              ...GatsbyImageSharpFixed
            }
          }
        }
        site {
          siteMetadata {
            title
            author
            social {
              github
            }
          }
        }
      }
    `,
  );

  const {title, author, social} = site.siteMetadata;
  return (
    <header className={style.header}>
      <div className={style.left}>
        <Link to={`/`} className={style.leftLink}>
          <Image
            fixed={avatar.childImageSharp.fixed}
            alt={author}
            imgStyle={{borderRadius: `50%`, width: '28px', height: '28px'}}
            className={style.leftImage}
          />
          &nbsp;
          <span className={style.leftText}>{title}</span>
        </Link>
      </div>
      <div className={style.middle}></div>
      <div className={style.right}>
        <a
          href={`https://github.com/${social.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className={style.right}
        >
          <span className={style.rightText}>github</span>&nbsp;
          <GitHub />
        </a>
      </div>
    </header>
  );
}
