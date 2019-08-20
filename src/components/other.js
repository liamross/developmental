import {Link} from 'gatsby';
import React from 'react';
import style from './other.module.scss';

export default function Other({other, isNew}) {
  // For testing:
  // other = {fields: {slug: ''}, frontmatter: {title: 'Some'}};
  return other ? (
    <Link
      to={other.fields.slug}
      rel={isNew ? 'next' : 'prev'}
      className={[style.other, isNew ? style.new : undefined].join(' ')}
    >
      <>
        {!isNew ? <div className={style.arrow}>←</div> : null}
        <div className={style.otherText}>
          <p className={style.otherPhrase}>
            {isNew ? `Read the next article` : `Read the previous article`}
          </p>
          <p className={style.otherTitle}>{other.frontmatter.title}</p>
        </div>
        {isNew ? <div className={style.arrow}>→</div> : null}
      </>
    </Link>
  ) : null;
}
