import {Link} from 'gatsby';
import React from 'react';
import style from './list.module.scss';

export default function List({posts}) {
  return posts.map(({node}) => {
    const title = node.frontmatter.title || node.fields.slug;
    return (
      <div key={node.fields.slug} className={style.list}>
        <Link to={node.fields.slug} className={style.link}>
          <h1 className="page-title">{title}</h1>
          <h6 className="page-title">
            {node.frontmatter.date} - {node.timeToRead} minute read
          </h6>
          <p
            className="page-description"
            dangerouslySetInnerHTML={{
              __html: node.frontmatter.description || node.excerpt,
            }}
          />
        </Link>
      </div>
    );
  });
}
