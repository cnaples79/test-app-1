import React from 'react';
import Link from 'next/link';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Retro Space Shooter Game</h1>
      <Link href="/retro-space-shooter">
        Play the Game
      </Link>
    </div>
  );
};

export default Home;
