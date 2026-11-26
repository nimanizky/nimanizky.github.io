/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  output: process.env.NEXT_STATIC_EXPORT === 'true' ? 'export' : undefined,
}
