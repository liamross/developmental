import React from 'react';
import style from './layout.module.scss';
import Center from './center';
import Header from './header';

export default function Layout({children, nonBlog}) {
  return (
    <Center>
      <Header />
      {!nonBlog ? (
        <main>
          <article className={style.article}>{children}</article>
        </main>
      ) : (
        <main>{children}</main>
      )}
    </Center>
  );
}
