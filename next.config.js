/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  compress: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        /*destination: 'http://higo.abamaxa.com/api/:path*',*/
        destination: 'http://coco.abamaxa.com/api/:path*',
      },
    ]
  },
}
