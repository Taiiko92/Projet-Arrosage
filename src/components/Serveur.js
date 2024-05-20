// Import des modules nécessaires
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Création de l'application Express
const app = express();

// Utilisation de cors pour autoriser les requêtes cross-origin
app.use(cors());

// Utilisation de bodyParser pour analyser le corps des requêtes en JSON
app.use(bodyParser.json());

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
 host: 'localhost',
 user: 'phpmyadmin1',
 password: 'ciel',
 database: 'Authentification',
 port: 3306,
});

// Connexion à la base de données
db.connect();

// Route pour gérer la connexion des utilisateurs
app.post('/connexion', (req, res) => {
  const { Identifiant, MotDePasse } = req.body;

  // Vérification si l'Identifiant existe dans la base de données
  const query = 'SELECT * FROM Utilisateurs WHERE Identifiant = ? AND MotDePasse = ?';
  db.query(query, [Identifiant, MotDePasse], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'Identifiant :', err);
      return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la vérification de l\'Identifiant' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Identifiant ou mot de passe incorrect' });
    }

    const user = results[0];
    
    // Authentification réussie
    res.status(200).json({ success: true, message: 'Authentification réussie', user });
  });
});

app.post('/ajouterUtilisateur', (req, res) => {
  const { Identifiant, MotDePasse } = req.body;

  // Insertion de l'utilisateur dans la base de données avec le mot de passe en clair
  const query = 'INSERT INTO Utilisateurs (Identifiant, MotDePasse) VALUES (?, ?)';
  db.query(query, [Identifiant, MotDePasse], (error) => {
      if (error) {
          console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
          return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de l\'utilisateur' });
      }

      res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
  });
});


// Démarrage du serveur sur le port 3000
app.listen(3000, () => {
 console.log('Serveur démarré sur http://localhost:3000');
});
