import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

export default defineConfig({

  integrations: [react()],

  adapter: vercel(),

  redirects: {
    '/dtc': {
      status: 302,
      destination: 'https://www.youtube.com/playlist?list=PLfzsxh8e8t4A'
    },

    '/DTC': {
      status: 302,
      destination: 'https://www.youtube.com/playlist?list=PLfzsxh8e8t4A'
    }
  }

});