import type { NextPage } from 'next';
import Head from 'next/head';

import InventoryManagement from '@/components/InventoryManagement';

import styles from './index.module.scss'

const Home: NextPage = () => {




  return (
    <>
      <Head>
        <title>Homepage | Your Website</title>
      </Head>

      <InventoryManagement />
    </>
  );
};

export default Home;
