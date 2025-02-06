// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn.sanity.io',
          pathname: '/**',
        },
      ],
      domains: ['lh3.googleusercontent.com', 'static.nike.com',  "cdn.sanity.io"],
      // Add the Google image domain here
    },
  }
  