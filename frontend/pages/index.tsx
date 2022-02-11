import Head from 'next/head';
import App from '../components/App';
import Game from '../components/Game';
import { initializeApollo, addApolloState } from '../lib/apolloClient';

function IndexPage() {
  return (
    <App>
      <Head>
        <title>Wordle Unlimited</title>
      </Head>
      <Game />
    </App>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

export default IndexPage;
