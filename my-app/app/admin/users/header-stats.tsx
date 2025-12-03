"use client";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetUsersResponse } from "@/lib/types";
import { User } from "lucide-react";

interface HeaderStatsProps {
  usersData: GetUsersResponse;
}

export function HeaderStats({ usersData }: HeaderStatsProps) {
  return (
    <>
      <div
        className={`*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs pb-2 grid-cols-1`}
      >
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardAction>
              <User />
            </CardAction>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {usersData.count}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
