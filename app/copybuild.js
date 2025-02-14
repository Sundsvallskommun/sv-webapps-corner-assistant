import { copyFile } from "copy-file";

try {
  await copyFile(
    "./dist/js/assistant-corner.js",
    "../sitevision/assets/assistant-corner.js"
  );
  await copyFile("./src/types/shared.ts", "../sitevision/src/types/shared.ts");
} catch (e) {
  console.log(e);
}
