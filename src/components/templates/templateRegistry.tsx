"use client";

import dynamic from "next/dynamic";
import React from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { type SaywithData } from "@/app/fr/[id]/page";

export const TEMPLATE_REGISTRY: Record<string, React.ComponentType<{ data: any }>> = {
  template1: dynamic(() => import('./Template1'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template2: dynamic(() => import('./Template2'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template3: dynamic(() => import('./Template3'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template4: dynamic(() => import('./Template4'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template5: dynamic(() => import('./Template5'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template6: dynamic(() => import('./Template6'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template7: dynamic(() => import('./Template7'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template8: dynamic(() => import('./Template8'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template9: dynamic(() => import('./Template9'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template10: dynamic(() => import('./Template10'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template11: dynamic(() => import('./Template11'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template12: dynamic(() => import('./Template12'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template13: dynamic(() => import('./Template13'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template14: dynamic(() => import('./Template14'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template15: dynamic(() => import('./Template15'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template16: dynamic(() => import('./Template16'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template17: dynamic(() => import('./Template17'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template18: dynamic(() => import('./Template18'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template19: dynamic(() => import('./Template19'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template20: dynamic(() => import('./Template20'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template21: dynamic(() => import('./Template21'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template22: dynamic(() => import('./Template22'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template23: dynamic(() => import('./Template23'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template24: dynamic(() => import('./Template24'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template25: dynamic(() => import('./Template25'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template26: dynamic(() => import('./Template26'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template27: dynamic(() => import('./Template27'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template28: dynamic(() => import('./Template28'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template29: dynamic(() => import('./Template29'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template30: dynamic(() => import('./Template30'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template31: dynamic(() => import('./Template31'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template32: dynamic(() => import('./Template32'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template33: dynamic(() => import('./Template33'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template34: dynamic(() => import('./Template34'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template35: dynamic(() => import('./Template35'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template36: dynamic(() => import('./Template36'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template37: dynamic(() => import('./Template37'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template38: dynamic(() => import('./Template38'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template39: dynamic(() => import('./Template39'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template40: dynamic(() => import('./Template40'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template41: dynamic(() => import('./Template41'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template42: dynamic(() => import('./Template42'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template43: dynamic(() => import('./Template43'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template44: dynamic(() => import('./Template44'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template45: dynamic(() => import('./Template45'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template46: dynamic(() => import('./Template46'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template47: dynamic(() => import('./Template47'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template48: dynamic(() => import('./Template48'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template49: dynamic(() => import('./Template49'), { ssr: false, loading: () => <LoadingSpinner /> }),
  template50: dynamic(() => import('./Template50'), { ssr: false, loading: () => <LoadingSpinner /> }),
};

export function getTemplateComponent(templateName?: string) {
  if (!templateName) return null;
  return TEMPLATE_REGISTRY[templateName.toLowerCase()] || null;
}
