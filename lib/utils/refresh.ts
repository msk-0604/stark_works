import { startTransition } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

/** 画面をブロックせず、バックグラウンドでサーバーデータを同期する */
export function backgroundRefresh(router: AppRouterInstance) {
  startTransition(() => {
    router.refresh();
  });
}
