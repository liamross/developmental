import {Link} from 'gatsby';
import React from 'react';
import style from './other.module.scss';

export default function Other({other, isNew}) {
  other = {fields: {slug: ''}, frontmatter: {title: 'Some'}};
  return (
    <div className={[style.other, isNew ? style.new : undefined].join(' ')}>
      {other ? (
        <>
          {!isNew ? <div>←</div> : null}
          <Link to={other.fields.slug} rel={isNew ? 'next' : 'prev'}>
            {isNew ? `Read the next article` : `Read the previous article`}
            <p>{other.frontmatter.title}</p>
          </Link>
          {isNew ? <div>→</div> : null}
        </>
      ) : null}
    </div>
  );
}
