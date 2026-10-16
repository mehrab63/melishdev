import { sectionRoute } from "@/lib/routes";
const route = sectionRoute("blog");
export const generateMetadata = route.metadata;
export default route.Page;
