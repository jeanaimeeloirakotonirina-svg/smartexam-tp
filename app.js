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

/* =========================
   REFACTORED FUNCTIONS
   (réduction complexité Sonar)
========================= */

function calculateCertScore(moduleAScore, totalTimeMinutes, isWebcamVerified) {
    const validation = validateModuleA(moduleAScore);
    if (validation) return validation;

    if (moduleAScore < 200) {
        return handleLowModuleA(moduleAScore);
    }

    const score = computeScore(moduleAScore, totalTimeMinutes);

    return buildResult(score, isWebcamVerified);
}

function validateModuleA(score) {
    if (score === undefined || score === null) {
        return { finalScore: 0, status: "Erreur données" };
    }

    if (score < 0) {
        return { finalScore: 0, status: "Erreur score négatif" };
    }

    return null;
}

function handleLowModuleA(score) {
    if (score < 50)
        return { finalScore: score, status: "Échec critique - Module A très faible" };

    if (score < 100)
        return { finalScore: score, status: "Échec sévère - Module A faible" };

    return { finalScore: score, status: "Échec - Module A insuffisant" };
}

function computeScore(score, time) {
    let s = adjustScoreWithTime(score, time);
    return normalizeScore(s);
}

function buildResult(score, webcam) {
    if (score >= 700) {
        return {
            finalScore: score,
            status: getSuccessStatus(score, webcam)
        };
    }

    return {
        finalScore: score,
        status: getFailureStatus(score)
    };
}

/* =========================
   EXPORTS
========================= */

module.exports = {
    normalizeScore,
    adjustScoreWithTime,
    getFailureStatus,
    getSuccessStatus,
    calculateCertScore
};