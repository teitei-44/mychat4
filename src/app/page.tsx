import Link from "next/link";
import {
  FileDownIcon,
  Grid3x3Icon,
  ListChecksIcon,
  TargetIcon,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: TargetIcon,
    title: "핵심 목표 하나",
    body: "표의 한가운데에 이루고 싶은 단 하나의 목표를 적습니다.",
  },
  {
    icon: Grid3x3Icon,
    title: "세부 목표 8개",
    body: "핵심 목표를 둘러싼 8칸에 목표를 이루기 위한 요소를 적으면 바깥 블록 가운데에 자동으로 옮겨집니다.",
  },
  {
    icon: ListChecksIcon,
    title: "실천 과제 64개",
    body: "각 세부 목표마다 오늘 바로 할 수 있는 행동 8개를 채웁니다.",
  },
  {
    icon: FileDownIcon,
    title: "이미지·PDF 저장",
    body: "완성한 만다라트를 PNG 이미지나 A4 PDF로 저장해 책상 앞에 붙여 두세요.",
  },
];

// 랜딩 미리보기용 3×3 (가운데 블록)
const preview = [
  "건강",
  "공부",
  "관계",
  "재정",
  "올해의 목표",
  "취미",
  "커리어",
  "습관",
  "마음",
];

export default async function Home() {
  const user = await getCurrentUser();
  const startHref = user ? "/mandalarts/new" : "/signup";

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6">
            <p className="text-primary text-sm font-semibold">Mandal-Art</p>
            <h1 className="text-4xl leading-tight font-bold md:text-5xl">
              81칸으로 그리는
              <br />
              나의 목표 지도
            </h1>
            <p className="text-muted-foreground text-lg">
              만다라트는 9×9 표로 하나의 핵심 목표를 8개의 세부 목표와 64개의
              실천 과제로 쪼개는 목표 설계 기법입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={startHref}>시작하기</Link>
              </Button>
              {user ? (
                <Button asChild size="lg" variant="outline">
                  <Link href="/mandalarts">내 만다라트</Link>
                </Button>
              ) : (
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">로그인</Link>
                </Button>
              )}
            </div>
          </div>
          <div
            className="border-foreground/70 bg-border mx-auto grid w-full max-w-sm grid-cols-3 gap-px overflow-hidden rounded-xl border-2"
            aria-hidden
          >
            {preview.map((text, i) => (
              <div
                key={text}
                className={
                  i === 4
                    ? "bg-core text-core-foreground flex aspect-square items-center justify-center p-2 text-center font-bold"
                    : "bg-sub text-sub-foreground flex aspect-square items-center justify-center p-2 text-center font-semibold"
                }
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-muted/40 border-t">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body }) => (
              <div key={title} className="space-y-2">
                <Icon className="text-primary size-6" aria-hidden />
                <h2 className="font-semibold">{title}</h2>
                <p className="text-muted-foreground text-sm">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="text-muted-foreground border-t py-6 text-center text-xs">
        © 만다라트
      </footer>
    </>
  );
}
