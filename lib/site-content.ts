// JSON content is shared by server and client components.
import content from "../content/site.json";
const { navigation, processSteps, ...site } = content;
export { site, navigation, processSteps };
