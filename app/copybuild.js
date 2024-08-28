import { copyFile } from "copy-file";

try {
  await copyFile(
    "./dist/js/assistant-corner.js",
    "../sitevision/assets/assistant-corner.js"
  );
} catch (e) {
  console.log(e);
}
