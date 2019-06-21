import React from 'react';
import Layout from '../components/layout';
import SEO from '../components/seo';

export default function NotFoundPage({location}) {
  return (
    <Layout location={location}>
      <SEO title="404: Blog not found" />
      <h1 className="page-title">404: Blog not found</h1>
      <h6 className="page-title">
        {"I haven't written that one yet! Check back later."}
      </h6>
    </Layout>
  );
}
