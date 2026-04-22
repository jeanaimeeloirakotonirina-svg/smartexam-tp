// Refactoring : Plus de if/else imbriqués -> Early returns et fonctions séparées
const BONUS_THRESHOLD = 30;
const BONUS_POINTS = 50;
const MAX_SCORE = 1000;
const PASS_THRESHOLD = 700;

function applyTimeBonus(score, time) {
    if (time < BONUS_THRESHOLD) return Math.min(score + BONUS_POINTS, MAX_SCORE);
    return score;
}

function determineStatus(score, isWebcamVerified) {
    if (score < PASS_THRESHOLD) return "Échec - Score insuffisant";
    if (!isWebcamVerified) return "Attente de validation";
    return "Certifié";
}

function calculateCertScore(moduleA, time, webcam) {
    // Early return : Échec direct
    if (moduleA < 200) {
        return { finalScore: moduleA, status: "Échec - Module A insuffisant" };
    }

    const scoreWithBonus = applyTimeBonus(moduleA, time);
    const finalStatus = determineStatus(scoreWithBonus, webcam);
   
    return { finalScore: scoreWithBonus, status: finalStatus };
}

module.exports = { calculateCertScore };