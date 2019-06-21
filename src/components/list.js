import React from 'react';
import {Link} from 'gatsby';
import style from './list.module.scss';

export default function List({posts}) {
  return posts.map(({node}) => {
    const title = node.frontmatter.title || node.fields.slug;
    return (
      <div key={node.fields.slug} className={style.list}>
        <Link to={node.fields.slug} className={style.link}>
          <h1 className="page-title">{title}</h1>
          <h6 className="page-title">{node.frontmatter.date}</h6>
          <p
            dangerouslySetInnerHTML={{
              __html: node.frontmatter.description || node.excerpt,
            }}
          />
        </Link>
      </div>
    );
  });
}