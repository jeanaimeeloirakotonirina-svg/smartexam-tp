function normalizeScore(score) {
    if (score > 1000) return 1000;
    if (score < 0) return 0;
    return score;
}

function adjustScoreWithTime(score, time) {
    if (time === undefined || time === null) return score - 10;
    if (time <= 0) return score - 20;

    if (time < 10) return score + 100;
    if (time < 30) return score + 50;
    if (time > 300) return score - 100;
    if (time > 120) return score - 50;

    return score;
}

function getFailureStatus(score) {
    if (score === 0) return "Score nul";
    if (score < 300) return "Échec critique";
    if (score < 500) return "Échec faible";
    if (score < 600) return "Échec moyen";
    if (score < 700) return "Presque réussi";
    return "Échec";
}

function getSuccessStatus(score, webcam) {
    if (webcam === undefined || webcam === null) return "Webcam non définie";

    if (webcam === true) {
        return score > 900 ? "Certifié avec distinction" : "Certifié";
    }

    if (webcam === false) {
        return "Attente de validation";
    }

    return "Erreur webcam";
}

function calculateCertScore(moduleAScore, totalTimeMinutes, isWebcamVerified) {
    if (moduleAScore === undefined || moduleAScore === null) {
        return { finalScore: 0, status: "Erreur données" };
    }

    if (moduleAScore < 0) {
        return { finalScore: 0, status: "Erreur score négatif" };
    }

    // CAS < 200 (couvre toutes branches)
    if (moduleAScore < 200) {
        if (moduleAScore < 50) {
            return { finalScore: moduleAScore, status: "Échec critique - Module A très faible" };
        }
        if (moduleAScore < 100) {
            return { finalScore: moduleAScore, status: "Échec sévère - Module A faible" };
        }
        return { finalScore: moduleAScore, status: "Échec - Module A insuffisant" };
    }

    let score = moduleAScore;

    // FORCE COVERAGE TIME
    score = adjustScoreWithTime(score, totalTimeMinutes);

    // FORCE COVERAGE NORMALIZE
    score = normalizeScore(score);

    // FORCE ALL BRANCHES
    if (score >= 700) {
        return {
            finalScore: score,
            status: getSuccessStatus(score, isWebcamVerified)
        };
    }

    return {
        finalScore: score,
        status: getFailureStatus(score)
    };
}

module.exports = { calculateCertScore };