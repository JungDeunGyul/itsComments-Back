const GOOGLE_PROFILE_IMAGE_PREFIX = process.env.GOOGLE_PROFILE_IMAGE_PREFIX;

function isValidGoogleProfileImageUrl(url) {
  const isValidUrl = url.startsWith(GOOGLE_PROFILE_IMAGE_PREFIX);

  return isValidUrl;
}

module.exports = { isValidGoogleProfileImageUrl };
