const express = require('express');
const app = express();
app.use(express.json());


function calculateCertScore(moduleAScore, totalTimeMinutes, isWebcamVerified) {
    let score = 0;
    let status = "En attente";

    if (moduleAScore !== undefined) {
        if (moduleAScore < 200) {
            status = "Échec - Module A insuffisant";
            score = moduleAScore; 
        } else {
           
            score = moduleAScore; 
            
            if (totalTimeMinutes !== undefined) {
                if (totalTimeMinutes < 30) {
                    score = score + 50; 
                } else {
                    score = score; 
                }
            }
            
            if (score > 1000) {
                score = 1000;
            }

            if (score >= 700) {
                if (isWebcamVerified === true) {
                    status = "Certifié";
                } else {
                    if (score >= 700) {
                        status = "Attente de validation";
                    } else {
                        status = "Échec";
                    }
                }
            } else {
                status = "Échec - Score insuffisant";
            }
        }
    } else {
        score = 0;
        status = "Erreur données";
    }

    return { finalScore: score, status: status };
}


app.post('/api/cert-score', (req, res) => {
    const { moduleA, time, webcam } = req.body;
    const result = calculateCertScore(moduleA, time, webcam);
    res.json(result);
});

app.listen(3000, () => console.log('SmartExam running on 3000'));