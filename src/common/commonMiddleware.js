import jwt from "jsonwebtoken";

const commonMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(403).send({ error: "로그인이 필요합니다." });
  }

  const isValidToken = jwt.verify(token, process.env.JWT_KEY);

  if (!isValidToken) {
    res.status(403).send({ error: "로그인이 필요합니다." });
  }
  const loginUser = await req.prisma.user.findUnique({
    where: {
      email: isValidToken.email,
    },
  });
  req.user = loginUser;
  next();
};

export default commonMiddleware;
