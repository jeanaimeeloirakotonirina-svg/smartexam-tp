const {
  calculateCertScore,
  normalizeScore,
  adjustScoreWithTime,
  getFailureStatus,
  getSuccessStatus
} = require("../app");

describe("SmartExam Certification - FULL COVERAGE", () => {

  // ---------------- normalizeScore ----------------
  test("normalizeScore > 1000", () => {
    expect(normalizeScore(1500)).toBe(1000);
  });

  test("normalizeScore < 0", () => {
    expect(normalizeScore(-50)).toBe(0);
  });

  test("normalizeScore normal", () => {
    expect(normalizeScore(500)).toBe(500);
  });

  // ---------------- adjustScoreWithTime ----------------
  test("time undefined", () => {
    expect(adjustScoreWithTime(100, undefined)).toBe(90);
  });

  test("time null", () => {
    expect(adjustScoreWithTime(100, null)).toBe(90);
  });

  test("time <= 0", () => {
    expect(adjustScoreWithTime(100, 0)).toBe(80);
  });

  test("time < 10", () => {
    expect(adjustScoreWithTime(100, 5)).toBe(200);
  });

  test("time < 30", () => {
    expect(adjustScoreWithTime(100, 20)).toBe(150);
  });

  test("time > 300", () => {
    expect(adjustScoreWithTime(100, 350)).toBe(0);
  });

  test("time > 120", () => {
    expect(adjustScoreWithTime(100, 200)).toBe(50);
  });

  test("time normal", () => {
    expect(adjustScoreWithTime(100, 60)).toBe(100);
  });

  // ---------------- getFailureStatus ----------------
  test("failure statuses", () => {
    expect(getFailureStatus(0)).toBe("Score nul");
    expect(getFailureStatus(200)).toBe("Échec critique");
    expect(getFailureStatus(400)).toBe("Échec faible");
    expect(getFailureStatus(550)).toBe("Échec moyen");
    expect(getFailureStatus(650)).toBe("Presque réussi");
    expect(getFailureStatus(800)).toBe("Échec");
  });

  // ---------------- getSuccessStatus ----------------
  test("webcam undefined", () => {
    expect(getSuccessStatus(800, undefined)).toBe("Webcam non définie");
  });

  test("webcam null", () => {
    expect(getSuccessStatus(800, null)).toBe("Webcam non définie");
  });

  test("webcam true distinction", () => {
    expect(getSuccessStatus(950, true)).toBe("Certifié avec distinction");
  });

  test("webcam true normal", () => {
    expect(getSuccessStatus(800, true)).toBe("Certifié");
  });

  test("webcam false", () => {
    expect(getSuccessStatus(800, false)).toBe("Attente de validation");
  });

  test("webcam invalid", () => {
    expect(getSuccessStatus(800, "x")).toBe("Erreur webcam");
  });

  // ---------------- calculateCertScore ----------------
  test("moduleA undefined", () => {
    expect(calculateCertScore(undefined, 10, true).status)
      .toBe("Erreur données");
  });

  test("moduleA null", () => {
    expect(calculateCertScore(null, 10, true).status)
      .toBe("Erreur données");
  });

  test("moduleA negative", () => {
    expect(calculateCertScore(-5, 10, true).status)
      .toBe("Erreur score négatif");
  });

  test("moduleA < 50", () => {
    expect(calculateCertScore(30, 10, true).status)
      .toContain("très faible");
  });

  test("moduleA < 100", () => {
    expect(calculateCertScore(80, 10, true).status)
      .toContain("faible");
  });

  test("moduleA < 200", () => {
    expect(calculateCertScore(150, 10, true).status)
      .toContain("insuffisant");
  });

  test("success >= 700", () => {
    const result = calculateCertScore(900, 10, true);
    expect(result.finalScore).toBeDefined();
  });

  test("failure < 700", () => {
    const result = calculateCertScore(500, 10, false);
    expect(result.status).toBeDefined();
  });

});