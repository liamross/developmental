import {graphql, Link, useStaticQuery} from 'gatsby';
import Image from 'gatsby-image';
import React, {useState} from 'react';
import GitHub from './github';
import style from './header.module.scss';
import LinkedIn from './linkedin';

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
            description
            author
            social {
              github
              linkedin
            }
          }
        }
      }
    `,
  );

  const {title, description, author, social} = site.siteMetadata;

  const githubLink = `github.com/${social.github}`;
  const linkedinLink = `linkedin.com/in/${social.linkedin}`;

  const [leftHovered, setLeftHovered] = useState(false);
  const [githubHovered, setGithubHovered] = useState(false);
  const [linkedinHovered, setLinkedinHovered] = useState(false);

  const noneHovered = !leftHovered && !githubHovered && !linkedinHovered;

  return (
    <header className={style.header}>
      <div className={style.left}>
        <Link
          to={`/`}
          className={style.leftLink}
          onMouseEnter={() => setLeftHovered(true)}
          onMouseLeave={() => setLeftHovered(false)}
        >
          <Image
            fixed={avatar.childImageSharp.fixed}
            alt={author}
            imgStyle={{borderRadius: `50%`, width: '28px', height: '28px'}}
            className={style.leftImage}
          />
          <div className={style.leftText}>
            <div
              className={[
                style.leftTextInner,
                noneHovered ? style.hovered : undefined,
              ].join(' ')}
            >
              {title}
            </div>
            <div
              className={[
                style.leftTextInner,
                leftHovered ? style.hovered : undefined,
              ].join(' ')}
            >
              {`"${description}"`}
            </div>
            <div
              className={[
                style.leftTextInner,
                githubHovered ? style.hovered : undefined,
              ].join(' ')}
            >
              {githubLink}
            </div>
            <div
              className={[
                style.leftTextInner,
                linkedinHovered ? style.hovered : undefined,
              ].join(' ')}
            >
              {linkedinLink}
            </div>
          </div>
        </Link>
      </div>
      <div className={style.middle}></div>
      <div className={style.right}>
        <a
          href={`https://${githubLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className={style.rightLink}
          onMouseEnter={() => setGithubHovered(true)}
          onMouseLeave={() => setGithubHovered(false)}
        >
          <GitHub />
        </a>
        <a
          href={`https://${linkedinLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className={style.rightLink}
          onMouseEnter={() => setLinkedinHovered(true)}
          onMouseLeave={() => setLinkedinHovered(false)}
        >
          <LinkedIn />
        </a>
      </div>
    </header>
  );
}
