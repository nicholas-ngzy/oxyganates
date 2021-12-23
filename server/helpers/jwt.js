import expressJwt from 'express-jwt';

const authJwt = () => {
  const secret = process.env.SECRET;
  const api = process.env.API_URL;
  const categoryId = 1;
  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: `${api}/categories/${categoryId}/products`, methods: ['GET', 'OPTIONS'] },
      `${api}/products`,
      `${api}/login`,
      `${api}/register`,
    ],
  });
};

const isRevoked = async (req, payload, done) => {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
};

export default authJwt;
