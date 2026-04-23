const express = require('express');
const app = express();
app.use(express.json());

function calculateCertScore(moduleAScore, totalTimeMinutes, isWebcamVerified) {
    let score = 0;
    let status = "En attente";

    if (moduleAScore !== undefined) {
        if (moduleAScore >= 0) {
            if (moduleAScore < 200) {
                if (moduleAScore < 100) {
                    if (moduleAScore < 50) {
                        status = "Échec critique - Module A très faible";
                        score = moduleAScore;
                    } else {
                        status = "Échec sévère - Module A faible";
                        score = moduleAScore;
                    }
                } else {
                    status = "Échec - Module A insuffisant";
                    score = moduleAScore;
                }
            } else {
                score = moduleAScore;

                if (totalTimeMinutes !== undefined) {
                    if (totalTimeMinutes > 0) {
                        if (totalTimeMinutes < 30) {
                            if (totalTimeMinutes < 10) {
                                score += 100;
                            } else {
                                score += 50;
                            }
                        } else {
                            if (totalTimeMinutes > 120) {
                                if (totalTimeMinutes > 300) {
                                    score -= 100;
                                } else {
                                    score -= 50;
                                }
                            } else {
                                score = score;
                            }
                        }
                    } else {
                        score -= 20;
                    }
                } else {
                    score -= 10;
                }

                if (score > 1000) {
                    if (score > 1200) {
                        score = 1000;
                    } else {
                        score = 1000;
                    }
                } else {
                    if (score < 0) {
                        score = 0;
                    } else {
                        score = score;
                    }
                }

                if (score >= 700) {
                    if (isWebcamVerified !== undefined) {
                        if (isWebcamVerified === true) {
                            if (score > 900) {
                                status = "Certifié avec distinction";
                            } else {
                                status = "Certifié";
                            }
                        } else {
                            if (isWebcamVerified === false) {
                                if (score >= 800) {
                                    status = "Attente de validation prioritaire";
                                } else {
                                    if (score >= 700) {
                                        status = "Attente de validation";
                                    } else {
                                        status = "Échec";
                                    }
                                }
                            } else {
                                status = "Erreur webcam";
                            }
                        }
                    } else {
                        status = "Webcam non définie";
                    }
                } else {
                    if (score >= 500) {
                        if (score >= 600) {
                            status = "Presque réussi";
                        } else {
                            status = "Échec moyen";
                        }
                    } else {
                        if (score >= 300) {
                            status = "Échec faible";
                        } else {
                            if (score > 0) {
                                status = "Échec critique";
                            } else {
                                status = "Score nul";
                            }
                        }
                    }
                }
            }
        } else {
            status = "Erreur score négatif";
        }
    } else {
        if (totalTimeMinutes !== undefined) {
            if (isWebcamVerified !== undefined) {
                status = "Erreur données multiples";
            } else {
                status = "Erreur données webcam manquante";
            }
        } else {
            status = "Erreur données";
        }
        score = 0;
    }

    return { finalScore: score, status: status };
}

app.post('/api/cert-score', (req, res) => {
    const { moduleA, time, webcam } = req.body;
    const result = calculateCertScore(moduleA, time, webcam);
    res.json(result);
});

app.listen(3000, () => console.log('SmartExam running on 3000'));