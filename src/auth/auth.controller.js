import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const token = async (req, res) => {
  const token = req.headers.authorization;

  const isValidToken = jwt.verify(token, process.env.JWT_KEY);

  if (isValidToken) {
    const newAccessToken = jwt.sign(
      { email: isValidToken.email },
      process.env.JWT_KEY,
      { expiresIn: "3h" }
    );

    return res.status(200).send({
      accessToken : newAccessToken
    })
  }
};

export const signup = async (req, res) => {
  const { email, password } = req.body;
  const isEmailExist = await req.prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isEmailExist) {
    return res.status(400).send({ error: "이미 가입한 메일입니다." });
  } else {
    const hashPassword = await bcrypt.hash(password, 12);
    await req.prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    return res.status(200).send({ message: "가입되었습니다." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const isEmailExist = await req.prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!isEmailExist) {
    return res.status(400).send({ message: "등록되지 않은 이메일입니다." });
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    isEmailExist.password
  );

  if (!isCorrectPassword) {
    return res.status(400).send({ message: "비밀번호가 일치하지 않습니다." });
  }
  const accessToken = jwt.sign({ email }, process.env.JWT_KEY, {
    expiresIn: "3h",
  });
  const refreshToken = jwt.sign({ email }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });

  return res.status(200).send({
    accessToken,
    refreshToken,
  });
};
