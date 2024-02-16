function checkMails(emails) {
  const emailArray = emails.split(",").map((email) => email.trim());
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailArray.every((email) => emailRegex.test(email));
}

module.exports = { checkMails };
