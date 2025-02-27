import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import path from "path";

const app = express();
const prisma = new PrismaClient();

// Types pour les modèles
interface User {
  id: number;
  email: string;
  password: string;
  name: string | null;
}

interface Denonciation {
  id: number;
  description: string;
  categorie: string;
  localisation: string;
  date: Date;
  name: string;
  mots_cles: string[];
}

app.use(express.json());

// Route principale
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Routes User
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la création de l'utilisateur." });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la récupération des utilisateurs." });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) res.json(user);
    else res.status(404).json({ error: "Utilisateur non trouvé" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la récupération de l'utilisateur." });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la mise à jour de l'utilisateur." });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "Utilisateur supprimé" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la suppression de l'utilisateur." });
  }
});

// Routes Denonciation
app.post("/denonciations", async (req: Request, res: Response) => {
  const { description, categorie, localisation, name, mots_cles } = req.body;
  try {
    const denonciation = await prisma.denonciation.create({
      data: { description, categorie, localisation, name, mots_cles },
    });
    res.json(denonciation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la création de la dénonciation." });
  }
});

app.get("/denonciations", async (req: Request, res: Response) => {
  try {
    const denonciations = await prisma.denonciation.findMany();
    res.json(denonciations);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la récupération des dénonciations." });
  }
});

app.get("/denonciations/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const denonciation = await prisma.denonciation.findUnique({
      where: { id },
    });
    if (denonciation) res.json(denonciation);
    else res.status(404).json({ error: "Dénonciation non trouvée" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la récupération de la dénonciation." });
  }
});

app.put("/denonciations/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { description, categorie, localisation, name, mots_cles } = req.body;
  try {
    const denonciation = await prisma.denonciation.update({
      where: { id },
      data: { description, categorie, localisation, name, mots_cles },
    });
    res.json(denonciation);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la mise à jour de la dénonciation." });
  }
});

app.delete("/denonciations/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.denonciation.delete({ where: { id } });
    res.json({ message: "Dénonciation supprimée" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la suppression de la dénonciation." });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
