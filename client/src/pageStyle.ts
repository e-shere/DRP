import { ROOT_DEMO_PAGE } from "./App";
import { UserSettings, Preset } from "./common/domain";
import { applyPageStyle } from "./common/applyPageStyle";

function updatePage(s: UserSettings, p: Preset) {
  applyPageStyle(s, p, (doc) => { return doc.getElementById(ROOT_DEMO_PAGE) });
}

export { updatePage };