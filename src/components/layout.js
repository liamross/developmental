import React from 'react';
import {Link} from 'gatsby';
import style from './layout.module.scss';
import Center from './center';

function Layout({title, children, nonBlog}) {
  const header = (
    <h3>
      <Link to={`/`}>{title}</Link>
    </h3>
  );
  return (
    <Center>
      <header>{header}</header>
      {!nonBlog ? (
        <main>
          <article className={style.article}>{children}</article>
        </main>
      ) : (
        <main>{children}</main>
      )}
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </footer>
    </Center>
  );
}

export default Layout;
