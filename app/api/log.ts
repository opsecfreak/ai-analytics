import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { page, timeSpent } = req.body;
    const result = await prisma.userSession.create({
      data: { page, timeSpent }
    });
    return res.status(200).json(result);
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}