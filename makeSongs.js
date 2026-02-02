import fs from "fs";
import path from "path";

const base = "songs";

fs.readdirSync(base).forEach(folder => {
  const folderPath = path.join(base, folder);

  if (fs.lstatSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith(".mp3"))
      .map(f => `songs/${folder}/${encodeURIComponent(f)}`);

    const json = { songs: files };

    fs.writeFileSync(
      path.join(folderPath, "songs.json"),
      JSON.stringify(json, null, 2)
    );

    console.log("Created songs.json for:", folder);
  }
});
