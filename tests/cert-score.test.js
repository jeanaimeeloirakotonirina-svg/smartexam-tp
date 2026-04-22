const { calculateCertScore } = require('../app');

describe('SmartExam Certification', () => {

    test('Échec direct si Module A < 200', () => {
        const result = calculateCertScore(150, 40, true);
        expect(result.status).toBe("Échec - Module A insuffisant");
        expect(result.finalScore).toBe(150);
    });

    test('Bonus de rapidité (+50) si temps < 30min', () => {
        const result = calculateCertScore(800, 25, true);
        expect(result.finalScore).toBeGreaterThan(800);
    });

    test('Statut en attente si webcam non vérifiée', () => {
        const result = calculateCertScore(800, 40, false);
        expect(result.status).toContain("Attente");
    });

    test('Certifié si score élevé + webcam OK', () => {
        const result = calculateCertScore(800, 40, true);
        expect(result.status).toContain("Certifié");
    });

    test('Échec si score < seuil', () => {
        const result = calculateCertScore(300, 40, true);
        expect(result.status).toContain("Échec");
    });

    test('Pas de bonus si temps >= 30', () => {
        const result = calculateCertScore(800, 40, true);
        expect(result.finalScore).toBe(800);
    });

    
    test('Gestion moduleA null', () => {
        const result = calculateCertScore(null, 40, true);
        expect(result.status).toBe("Échec - Module A insuffisant");
    });

});