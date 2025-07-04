// backend/server.js
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(cors());
app.use(express.json());

// Produits simples avec options et stock
let products = [
  {
    id: 1,
    name: "T-shirt blanc enfants",
    options: [
      { size: "0-6 ans", color: "Blanc", price: 1000, stock: 10 },
      { size: "8-10 ans", color: "Blanc", price: 1500, stock: 7 },
    ],
  },
  {
    id: 2,
    name: "T-shirt couleurs enfants",
    options: [
      { size: "0-6 ans", color: "Couleur", price: 1200, stock: 15 },
      { size: "8-10 ans", color: "Couleur", price: 1500, stock: 12 },
    ],
  },
  {
    id: 3,
    name: "T-shirt adulte",
    options: [
      { size: "Standard", color: "Blanc", price: 2000, stock: 20 },
      { size: "Standard", color: "Couleur", price: 2500, stock: 20 },
    ],
  },
];

// Commandes stockées en mémoire
let orders = [];

// Nodemailer config (remplace avec tes vrais identifiants)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ton.email@gmail.com',
    pass: 'ton_mdp_app',
  }
});

// Route GET produits
app.get('/products', (req, res) => {
  const safeProducts = products.map(p => ({
    id: p.id,
    name: p.name,
    options: p.options.map(({ size, color, price }) => ({ size, color, price })),
  }));
  res.json(safeProducts);
});

// Route POST commandes
app.post('/orders', (req, res) => {
  const order = req.body;

  // Vérification stock
  for(const item of order.items){
    const product = products.find(p => p.id === item.id);
    if(!product) return res.status(400).json({message: `Produit ${item.id} inconnu`});
    const option = product.options.find(o => o.size === item.size && o.color === item.color);
    if(!option) return res.status(400).json({message: "Option invalide"});
    if(option.stock < item.quantity) return res.status(400).json({message: `Stock insuffisant pour ${product.name}`});
  }

  // Déduction stock
  for(const item of order.items){
    const product = products.find(p => p.id === item.id);
    const option = product.options.find(o => o.size === item.size && o.color === item.color);
    option.stock -= item.quantity;
  }

  order.id = orders.length + 1;
  order.date = new Date();
  orders.push(order);

  // Envoi mail (simplifié)
  if(order.email){
    const mailOptions = {
      from: '"Sonia Liebe Shop" <ton.email@gmail.com>',
      to: order.email,
      subject: `Confirmation commande #${order.id}`,
      text: `Merci pour votre commande #${order.id}. Total: ${order.items.reduce((acc,i) => acc + i.price * i.quantity, 0)} F CFA`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if(err) console.error(err);
      else console.log('Mail envoyé : ' + info.response);
    });
  }

  res.json({ message: "Commande enregistrée", orderId: order.id });
});

// Route POST paiement simulé
app.post('/payment', (req, res) => {
  const { phone, amount } = req.body;
  console.log(`Paiement simulé: ${amount} F CFA via ${phone}`);
  setTimeout(() => {
    res.json({ status: "success", message: "Paiement accepté" });
  }, 1500);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend lancé sur http://localhost:${PORT}`));
