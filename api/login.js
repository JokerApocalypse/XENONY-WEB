const supabase = require('../lib/supabaseClient');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Méthode non autorisée');

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    const { email, password } = JSON.parse(body);

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (findError || !user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    // Vérifier si l'utilisateur est confirmé
    if (!user.confirmed) {
      return res.status(403).json({ error: 'Compte non confirmé.' });
    }

    res.status(200).json({ success: true, nom: user.nom, prenom: user.prenom });
  });
};