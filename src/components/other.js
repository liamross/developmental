import {Link} from 'gatsby';
import React from 'react';
import style from './other.module.scss';

export default function Other({other, isNew}) {
  return (
    <div className={style.other}>
      {other ? (
        <>
          {!isNew ? <div>←</div> : null}
          <Link to={other.fields.slug} rel="prev">
            {isNew ? `Read the next article` : `Read the previous article`}
            <p>{other.frontmatter.title}</p>
          </Link>
          {isNew ? <div>→</div> : null}
        </>
      ) : null}
    </div>
  );
}
