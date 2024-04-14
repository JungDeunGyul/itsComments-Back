const nodemailer = require("nodemailer");
const { sendMail } = require("../utiles/mailSender");

jest.mock("nodemailer");

const transporter = {
  sendMail: jest.fn(),
};

nodemailer.createTransport.mockReturnValue(transporter);

describe("sendMail function", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send an email successfully", async () => {
    transporter.sendMail.mockResolvedValue(true);
    const result = await sendMail(
      "test@example.com",
      "user@example.com",
      "Hello, this is a test",
      "http://example.com",
      "http://example.com/image.png",
    );

    expect(transporter.sendMail).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it("should handle failures in sending an email", async () => {
    transporter.sendMail.mockRejectedValue(new Error("Failed to send email"));
    const result = await sendMail(
      "test@example.com",
      "user@example.com",
      "Hello, this is a test",
      "http://example.com",
      "http://example.com/image.png",
    );
    expect(transporter.sendMail).toHaveBeenCalledTimes(1);
    expect(result).toBe(false);
  });
});
