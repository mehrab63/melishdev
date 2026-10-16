import { sectionRoute } from "@/lib/routes";
const route = sectionRoute("about");
export const generateMetadata = route.metadata;
export default route.Page;
