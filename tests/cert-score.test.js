const { calculateCertScore } = require('../app');

describe('SmartExam Certification - FULL COVERAGE', () => {

    // ========================
    // MODULE A (branches 20–25)
    // ========================
    test('moduleA = 0', () => {
        const r = calculateCertScore(0, 40, true);
        expect(r.status).toContain("Échec critique");
    });

    test('moduleA 1-49', () => {
        const r = calculateCertScore(25, 40, true);
        expect(r.status).toContain("Échec critique");
    });

    test('moduleA 50-99', () => {
        const r = calculateCertScore(75, 40, true);
        expect(r.status).toContain("Échec");
    });

    test('moduleA 100-199', () => {
        const r = calculateCertScore(150, 40, true);
        expect(r.status).toContain("Échec");
    });

    // ========================
    // TIME ADJUSTMENT (36–44)
    // ========================
    test('time undefined', () => {
        const r = calculateCertScore(800, undefined, true);
        expect(r.finalScore).toBeDefined();
    });

    test('time null', () => {
        const r = calculateCertScore(800, null, true);
        expect(r.finalScore).toBeDefined();
    });

    test('time <= 0', () => {
        const r = calculateCertScore(800, 0, true);
        expect(r.finalScore).toBeLessThan(800);
    });

    test('time < 10', () => {
        const r = calculateCertScore(800, 5, true);
        expect(r.finalScore).toBeGreaterThan(800);
    });

    test('time < 30', () => {
        const r = calculateCertScore(800, 20, true);
        expect(r.finalScore).toBeGreaterThan(800);
    });

    test('time > 120', () => {
        const r = calculateCertScore(800, 150, true);
        expect(r.finalScore).toBeLessThan(800);
    });

    test('time > 300', () => {
        const r = calculateCertScore(800, 400, true);
        expect(r.finalScore).toBeLessThan(800);
    });

    // ========================
    // NORMALIZE (48)
    // ========================
    test('score > 1000 clamp', () => {
        const r = calculateCertScore(1500, 10, true);
        expect(r.finalScore).toBeLessThanOrEqual(1000);
    });

    test('negative indirect score handling', () => {
        const r = calculateCertScore(800, -10, true);
        expect(r.finalScore).toBeDefined();
    });

    // ========================
    // SUCCESS / FAILURE PATH (78)
    // ========================
    test('success path >= 700', () => {
        const r = calculateCertScore(900, 40, true);
        expect(r.finalScore).toBeGreaterThanOrEqual(700);
    });

    test('failure path < 700', () => {
        const r = calculateCertScore(600, 40, true);
        expect(r.status).toBeDefined();
    });

    // ========================
    // WEBCASE EDGE CASES
    // ========================
    test('webcam false', () => {
        const r = calculateCertScore(800, 40, false);
        expect(r.status).toBe("Attente de validation");
    });

    test('webcam string invalid', () => {
        const r = calculateCertScore(800, 40, "abc");
        expect(r.status).toBe("Erreur webcam");
    });

    test('certifié distinction', () => {
        const r = calculateCertScore(950, 10, true);
        expect(r.status).toBe("Certifié avec distinction");
    });

});