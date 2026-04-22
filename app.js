function applyTimeBonus(score, time = 9999) {
    return time < 30 ? Math.min(score + 50, 1000) : score;
}

function validate(moduleA) {
    if (moduleA == null) {
        return { ok: false, status: "Erreur données" };
    }

    if (moduleA < 200) {
        return { ok: false, status: "Échec - Module A insuffisant" };
    }

    return { ok: true };
}

function getStatus(score, webcam = false) {
    if (webcam !== true) {
        return "Attente de validation";
    }

    if (score >= 700) return "Certifié";

    return "Échec - Score insuffisant";
}

function calculateCertScore(moduleA, time, webcam) {
    const check = validate(moduleA);
    if (!check.ok) {
        return { finalScore: 0, status: check.status };
    }

    const score = applyTimeBonus(moduleA, time);
    const status = getStatus(score, webcam === true);

    return { finalScore: score, status };
}

module.exports = { calculateCertScore };