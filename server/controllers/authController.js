const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required' });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return res.status(400).json({ success: false, message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed }
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: generateToken(user),
    user: { id: user.id, name: user.name, email: user.email }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'All fields required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(400).json({ success: false, message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ success: false, message: 'Invalid email or password' });

  res.json({
    success: true,
    message: 'Login successful',
    token: generateToken(user),
    user: { id: user.id, name: user.name, email: user.email }
  });
};

const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, createdAt: true }
  });
  res.json({ success: true, user });
};

module.exports = { register, login, getMe };