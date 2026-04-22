function applyTimeBonus(score, time) {
    if (time < 30) return Math.min(score + 50, 1000);
    return score;
}

function determineStatus(score, isWebcamVerified) {
    if (score < 200) return "Échec - Module A insuffisant";
    if (score < 700) return "Échec - Score insuffisant";
    if (!isWebcamVerified) return "Attente de validation";
    return "Certifié";
}

function calculateCertScore(moduleA, time, webcam) {
    if (moduleA === null || moduleA === undefined) {
        return { finalScore: 0, status: "Erreur données" };
    }

    const scoreWithBonus = applyTimeBonus(moduleA, time);
    const status = determineStatus(scoreWithBonus, webcam);

    return { finalScore: scoreWithBonus, status };
}

module.exports = { calculateCertScore };