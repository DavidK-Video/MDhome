import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: 'public_nWAwaKXSj2CjbCBwW6bbtnOI2Z8=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: 'https://ik.imagekit.io/4dttz7b4w',
});

export default function handler(req, res) {
  const auth = imagekit.getAuthenticationParameters();
  res.json(auth);
}
