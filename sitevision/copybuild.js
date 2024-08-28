import { copyFile } from "copy-file";

try {
  await copyFile(
    "../app/dist/js/assistant-corner.js",
    "./assets/assistant-corner.js"
  );
} catch (e) {
  throw Error(
    "Du måste först bygga ut appen. Gå till ../app och kör yarn build"
  );
}
