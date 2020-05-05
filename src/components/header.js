import {graphql, Link, useStaticQuery} from 'gatsby';
import React, {useState} from 'react';
import GitHub from './github';
import style from './header.module.scss';
import Liam from './liam';
import LinkedIn from './linkedin';

export default function Header() {
  const {site} = useStaticQuery(
    graphql`
      query HeaderQuery {
        site {
          siteMetadata {
            title
            description
            author
            social {
              github
              linkedin
              npm
            }
          }
        }
      }
    `,
  );

  const {title, description, social} = site.siteMetadata;

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
          onMouseOver={() => setLeftHovered(true)}
          onMouseOut={() => setLeftHovered(false)}
        >
          <div className={style.leftImage}>
            <Liam />
          </div>
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
          onMouseOver={() => setGithubHovered(true)}
          onMouseOut={() => setGithubHovered(false)}
        >
          <GitHub />
        </a>
        <a
          href={`https://${linkedinLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className={style.rightLink}
          onMouseOver={() => setLinkedinHovered(true)}
          onMouseOut={() => setLinkedinHovered(false)}
        >
          <LinkedIn />
        </a>
      </div>
    </header>
  );
}
