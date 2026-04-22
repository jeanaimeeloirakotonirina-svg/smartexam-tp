const express = require('express'); 
const app = express();
app.use(express.json());

function calculateCertScore(moduleAScore, totalTimeMinutes, isWebcamVerified) {
    let score = 0;
    let status = "En attente";

    // Validation données
    if (moduleAScore === undefined || moduleAScore === null) {
        return { finalScore: 0, status: "Erreur données" };
    }

    if (typeof moduleAScore !== "number") {
        return { finalScore: 0, status: "Type invalide" };
    }

    // Base score
    if (moduleAScore < 0) {
        score = 0;
        status = "Score invalide";
    } else if (moduleAScore < 100) {
        status = "Échec critique";
        score = moduleAScore;
    } else if (moduleAScore >= 100 && moduleAScore < 200) {
        status = "Échec - Module A insuffisant";
        score = moduleAScore;
    } else if (moduleAScore >= 200 && moduleAScore < 500) {
        score = moduleAScore + 20;
    } else if (moduleAScore >= 500 && moduleAScore < 800) {
        score = moduleAScore + 40;
    } else if (moduleAScore >= 800 && moduleAScore <= 1000) {
        score = moduleAScore + 60;
    } else {
        score = 1000;
    }

    // Time impact
    if (totalTimeMinutes !== undefined && totalTimeMinutes !== null) {
        if (totalTimeMinutes < 0) {
            score -= 100;
        } else if (totalTimeMinutes < 10) {
            score += 100;
        } else if (totalTimeMinutes >= 10 && totalTimeMinutes < 30) {
            score += 50;
        } else if (totalTimeMinutes >= 30 && totalTimeMinutes < 60) {
            score += 20;
        } else if (totalTimeMinutes >= 60 && totalTimeMinutes < 120) {
            score -= 10;
        } else if (totalTimeMinutes >= 120 && totalTimeMinutes < 180) {
            score -= 30;
        } else {
            score -= 50;
        }
    } else {
        score -= 20;
    }

    // Webcam logic
    if (isWebcamVerified === true) {
        if (score >= 900) {
            status = "Certifié élite";
        } else if (score >= 800) {
            status = "Certifié avec excellence";
        } else if (score >= 700) {
            status = "Certifié";
        } else if (score >= 500) {
            status = "Validation partielle";
        } else if (score >= 300) {
            status = "Faible validation";
        } else {
            status = "Échec malgré vérification";
        }
    } else if (isWebcamVerified === false) {
        if (score >= 900) {
            status = "Fraude probable";
        } else if (score >= 800) {
            status = "Suspicion fraude";
        } else if (score >= 700) {
            status = "Attente de validation";
        } else if (score >= 500) {
            status = "Refus - non vérifié";
        } else if (score >= 300) {
            status = "Refus partiel";
        } else {
            status = "Échec";
        }
    } else {
        if (score > 500) {
            status = "Inconnu mais acceptable";
        } else {
            status = "Statut webcam inconnu";
        }
    }

    // Extra rule set
    switch (true) {
        case (score > 1000):
            score = 1000;
            break;
        case (score < 0):
            score = 0;
            break;
        case (score >= 950):
            score += 10;
            break;
        case (score >= 900):
            score += 5;
            break;
        case (score >= 600 && score < 700):
            score += 2;
            break;
        case (score >= 400 && score < 500):
            score -= 5;
            break;
        default:
            score = score;
    }

    // Conditions supplémentaires (augmentation complexité)
    if (score >= 700) {
        if (isWebcamVerified && totalTimeMinutes < 60) {
            status += " - Rapide et sécurisé";
        } else if (isWebcamVerified && totalTimeMinutes >= 60) {
            status += " - Lent mais sécurisé";
        } else if (!isWebcamVerified && totalTimeMinutes < 60) {
            status += " - Rapide non vérifié";
        } else if (!isWebcamVerified && totalTimeMinutes >= 60) {
            status += " - Lent non vérifié";
        } else {
            status += " - Cas inconnu";
        }
    } else {
        if (score < 200) {
            status += " - Très faible";
        } else if (score >= 200 && score < 400) {
            status += " - Faible";
        } else if (score >= 400 && score < 600) {
            status += " - Moyen";
        } else {
            status += " - Limite";
        }
    }

    // Bonus logique combinée
    if ((score > 800 && isWebcamVerified) || (score > 900 && totalTimeMinutes < 30)) {
        status += " - Bonus spécial";
    }

    return { finalScore: score, status: status };
}

app.post('/api/cert-score', (req, res) => {
    const { moduleA, time, webcam } = req.body;
    const result = calculateCertScore(moduleA, time, webcam);
    res.json(result);
});

app.listen(3000, () => console.log('SmartExam running on 3000'));