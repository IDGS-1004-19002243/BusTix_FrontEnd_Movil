import React from 'react';
import Head from 'expo-router/head';

const APP_NAME = 'BusTix';

type Props = {
  title?: string | null;
  description?: string | null;
};

export default function Seo({ title, description }: Props) {
  const fullTitle = title && title !== '' ? `${title} - ${APP_NAME}` : APP_NAME;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description ? (
        <meta name="description" content={description} />
      ) : null}
    </Head>
  );
}
