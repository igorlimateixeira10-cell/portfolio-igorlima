import { isLocale, defaultLocale, getDictionary } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { SiteWallpaper } from "@/components/wallpaper/SiteWallpaper";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";
import { Qualify } from "@/sections/Qualify";
import { Benefits } from "@/sections/Benefits";
import { TechStack } from "@/sections/TechStack";
import { Projects } from "@/sections/Projects";
import { WhyMe } from "@/sections/WhyMe";
import { Services } from "@/sections/Services";
import { About } from "@/sections/About";
import { Process } from "@/sections/Process";
import { Contact } from "@/sections/Contact";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const locale = lang ?? defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <SiteWallpaper />
      <Header dict={dict} locale={locale} />
      <main className="flex-1">
        <Hero dict={dict} />
        <Qualify dict={dict} />
        <Benefits dict={dict} />
        <Projects dict={dict} />
        <WhyMe dict={dict} />
        <Services dict={dict} />
        <About dict={dict} />
        <Process dict={dict} />
        <TechStack dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} locale={locale} />
    </>
  );
}
