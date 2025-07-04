const supabase = require('../lib/supabaseClient');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end('Méthode non autorisée');

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    const { nom, prenom, email, password } = JSON.parse(body);

    // Générer un code aléatoire à 5 chiffres
    const code = Math.floor(10000 + Math.random() * 90000).toString();

    // Vérifier si l'email existe déjà
    const { data: existingUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé.' });
    }

    // Insérer l'utilisateur
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ nom, prenom, email, password, code, confirmed: false }]);

    if (insertError) {
      return res.status(500).json({ error: 'Erreur lors de l\'enregistrement.' });
    }

    res.status(200).json({ success: true, code });
  });
};