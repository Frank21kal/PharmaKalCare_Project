const fs = require("fs");
const path = require("path");
const directory = path.join(__dirname, "..", "uploads", "profile-pictures");
const types = {
  "image/jpeg": { ext: ".jpg", valid: b => b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[b.length - 2] === 0xff && b[b.length - 1] === 0xd9 },
  "image/png": { ext: ".png", valid: b => b.length > 8 && b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) },
  "image/gif": { ext: ".gif", valid: b => b.subarray(0, 6).toString("ascii").match(/^GIF8[79]a$/) },
  "image/webp": { ext: ".webp", valid: b => b.length > 12 && b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" }
};
module.exports = (req, res, next) => {
  try {
    const image = req.body.profilePicture;
    if (!image || typeof image.data !== "string" || !types[image.type]) return res.status(400).json({ message: "Choose a JPEG, PNG, WEBP or GIF image" });
    const buffer = Buffer.from(image.data, "base64");
    if (!buffer.length || buffer.length > 3 * 1024 * 1024 || !types[image.type].valid(buffer)) return res.status(400).json({ message: "Image is invalid or larger than 3 MB" });
    fs.mkdirSync(directory, { recursive: true });
    const filename = `${req.user._id}-${Date.now()}${types[image.type].ext}`;
    fs.writeFileSync(path.join(directory, filename), buffer, { flag: "wx" });
    req.file = { filename };
    next();
  } catch (error) { next(error); }
};
