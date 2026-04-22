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

    test('Gestion undefined', () => {
        const result = calculateCertScore(undefined, 40, true);
        expect(result.status).toBe("Erreur données");
    });

    test('Score plafonné à 1000', () => {
        const result = calculateCertScore(1500, 10, true);
        expect(result.finalScore).toBeLessThanOrEqual(1000);
    });

    test('Webcam false avec score élevé', () => {
    const result = calculateCertScore(800, 25, false);
    expect(result.status).toBe("Attente de validation");
    });

    test('Time undefined ne casse pas le score', () => {
    const result = calculateCertScore(800, undefined, true);
    expect(result.finalScore).toBeDefined();
    });

    test('Webcam null doit être géré', () => {
    const result = calculateCertScore(800, 40, null);
    expect(result.status).toBeDefined();
    });
    

    test('Cas extrême webcam string false', () => {
    const result = calculateCertScore(800, 40, "false");
    expect(result.status).toBeDefined();
    });
});