import { Home } from "@/components/home";
import { resolveLocale, type LocaleParams } from "@/lib/routes";
export default async function Page({ params }: LocaleParams) {
  return <Home locale={await resolveLocale(params)} />;
}
