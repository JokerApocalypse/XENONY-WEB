import express from 'express';
import bodyParser from 'body-parser';
import supabase from './supabase'; // Importation de Supabase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour l'inscription
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  // Création d'un nouvel utilisateur
  const { user, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true, message: 'Inscription réussie' });
});

// Route pour la connexion
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Connexion avec Supabase
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true, message: 'Connexion réussie' });
});

// Serve les pages HTML (login, register)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});