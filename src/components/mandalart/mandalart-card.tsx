import Link from "next/link";
import { formatDateTime } from "@/lib/format";
import {
  countFilled,
  TOTAL_CELLS,
  type Mandalart,
} from "@/lib/mandalart/mapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function MandalartCard({ mandalart }: { mandalart: Mandalart }) {
  const filled = countFilled(mandalart);
  const percent = Math.round((filled / TOTAL_CELLS) * 100);

  return (
    <Link
      href={`/mandalarts/${mandalart.id}`}
      className="group focus-visible:ring-ring/50 rounded-xl outline-none focus-visible:ring-[3px]"
    >
      <Card className="h-full gap-4 transition-shadow group-hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">
            {mandalart.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            <span className="text-primary font-medium">핵심 목표</span>{" "}
            {mandalart.coreGoal}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto space-y-1.5">
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>채운 칸</span>
            <span className="tabular-nums">
              {filled}/{TOTAL_CELLS}
            </span>
          </div>
          <div
            className="bg-muted h-1.5 overflow-hidden rounded-full"
            role="progressbar"
            aria-label="채운 칸 비율"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="bg-primary h-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground text-xs">
          수정일 {formatDateTime(mandalart.updatedAt)}
        </CardFooter>
      </Card>
    </Link>
  );
}
