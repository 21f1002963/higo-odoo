import ImageKit from "imagekit"

// Initialize ImageKit
export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_1/Rrbfah+wOUO3iU7gP9wtPMDvc=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_rOjyvzD7GZM40v9JcevOcXNKZZM=",
  urlEndpoint: `https://ik.imagekit.io/${process.env.IMAGEKIT_ID || "tsyh865yp"}/`,
})

// Generate authentication parameters for client-side upload
export function getAuthenticationParameters() {
  return imagekit.getAuthenticationParameters()
}
