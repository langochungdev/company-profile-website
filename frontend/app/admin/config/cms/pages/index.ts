export { homeConfig, type HomeConfig } from "./home.config";
export { aboutUsConfig, type AboutUsConfig } from "./about-us.config";
export { contactConfig, type ContactConfig } from "./contact.config";

import { homeConfig } from "./home.config";
import { aboutUsConfig } from "./about-us.config";
import { contactConfig } from "./contact.config";

export const PAGE_CONFIGS_CMS = {
    home: homeConfig,
    "about-us": aboutUsConfig,
    contact: contactConfig,
};
