const { checkMails } = require("../utiles/mailChecker");

describe("checkMails function", () => {
  test("should handle single email without comma", () => {
    const singleEmail = "example@example.com";
    expect(checkMails(singleEmail)).toBe(true);
  });

  test("should return true for valid email addresses", () => {
    const validEmails = "example@example.com, test@test.com";
    expect(checkMails(validEmails)).toBe(true);
  });

  test("should return false for any invalid email addresses", () => {
    const invalidEmails = "example@example.com, test-email";
    expect(checkMails(invalidEmails)).toBe(false);
  });

  test("should handle empty strings as invalid", () => {
    const emptyEmails = "";
    expect(checkMails(emptyEmails)).toBe(false);
  });

  test("should return false for non-email strings", () => {
    const nonEmail = "not an email";
    expect(checkMails(nonEmail)).toBe(false);
  });
});
