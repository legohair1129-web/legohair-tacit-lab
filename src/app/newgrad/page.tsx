import { Hero } from "@/components/newgrad/sections/01Hero";
import { StudentQuestion } from "@/components/newgrad/sections/02StudentQuestion";
import { Diagnosis } from "@/components/newgrad/sections/03Diagnosis";
import { DiagnosisResult } from "@/components/newgrad/sections/04DiagnosisResult";
import { MyStrength } from "@/components/newgrad/sections/05MyStrength";
import { ProduceExperience } from "@/components/newgrad/sections/06ProduceExperience";
import { GoodImpression } from "@/components/newgrad/sections/07GoodImpression";
import { BestBefore } from "@/components/newgrad/sections/08BestBefore";
import { GrowthExperience } from "@/components/newgrad/sections/09GrowthExperience";
import { OneDayExperience } from "@/components/newgrad/sections/10OneDayExperience";
import { SenpaiMatch } from "@/components/newgrad/sections/11SenpaiMatch";
import { RealBeautiful } from "@/components/newgrad/sections/12RealBeautiful";
import { SalonTour } from "@/components/newgrad/sections/13SalonTour";
import { WorkStyleExperience } from "@/components/newgrad/sections/14WorkStyleExperience";
import { RecruitInfo } from "@/components/newgrad/sections/15RecruitInfo";
import { MyFutureCard } from "@/components/newgrad/sections/16MyFutureCard";
import { FinalCta } from "@/components/newgrad/sections/17FinalCta";
import { Ending } from "@/components/newgrad/sections/Ending";

export default function NewGradPage() {
  return (
    <main>
      <Hero />
      <StudentQuestion />
      <Diagnosis />
      <DiagnosisResult />
      <MyStrength />
      <ProduceExperience />
      <GoodImpression />
      <BestBefore />
      <GrowthExperience />
      <OneDayExperience />
      <SenpaiMatch />
      <RealBeautiful />
      <SalonTour />
      <WorkStyleExperience />
      <RecruitInfo />
      <MyFutureCard />
      <FinalCta />
      <Ending />
    </main>
  );
}
