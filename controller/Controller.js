const express = require("express");
//exmple :
/*
const joueur = require("../models/exmple.schema");

exports.addJoueur = async (req, res) => {
    try {
        const newJoueur = await joueur.create({
            pseudo: req.body.pseudo,
            sante: 100,
            score: 0,
        });
        res.status(200).send("joueur ajouté : " + newJoueur.pseudo);
    } catch (err) {
        res.status(500).send(err);
    }
}
 */