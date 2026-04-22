const { calculateCertScore } = require('../app');

describe('SmartExam Certification', () => {

    test('Échec direct si Module A < 200', () => {
        const result = calculateCertScore(150, 40, true);
        expect(result.status).toBe("Échec - Module A insuffisant");
    });

    test('Bonus de rapidité si temps < 30min', () => {
        const result = calculateCertScore(800, 25, true);
        expect(result.finalScore).toBe(850);
    });

    test('Statut en attente si webcam non vérifiée', () => {
        const result = calculateCertScore(800, 40, false);
        expect(result.status).toBe("Attente de validation");
    });

    test('Erreur si moduleA null', () => {
        const result = calculateCertScore(null, 40, true);
        expect(result.status).toBe("Erreur données");
    });

});