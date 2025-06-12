import { useState } from 'react';
import {
  Button,
  Skeleton,
} from '@mui/material';

import '../styles/artworkTile.css';
import type { Artwork } from '../vite-env';

function ArtworkTile({ name, src, onClick }: Artwork) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Button
      className="artwork-tile"
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 0,
        overflow: 'hidden',
        borderRadius: 0,
        width: '100%',
        height: '100% !important',
        flexDirection: 'column',
      }}
    >
      {!loaded &&
        <Skeleton
          data-testid="skeleton"
          variant='rectangular'
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      }
      {
        <img
          src={src}
          alt={name}
          rel="preload"
          onLoad={() => setLoaded(true)}
          width='100%'
          height={!loaded ? '0%' : '100%'}
        />
      }
    </Button>
  )
}

export default ArtworkTile;