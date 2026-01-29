import { useState } from "react";

import { useVisitorFormStore } from "@/src/stores/useVisitorFormStore";
import { getVisitorByMobile } from "../api/services/visitorSelfRegistration.service";

export function useVisitorLookup() {
  const { setField, clearVisitorData } = useVisitorFormStore();
  const [loading, setLoading] = useState(false);

  const lookupVisitor = async (mobile: string) => {
    if (!mobile) return;

    setLoading(true);
    try {
      const res = await getVisitorByMobile(mobile);

      if (!res.success || !res.data) {
        clearVisitorData();
        return false;
      }

      const v = res.data;
      setField("visitorId", v.visitorId);
      setField("name", v.name);
      setField("company", v.visitorCompany);
      setField("address", v.address);
      setField("photoUrl", v.imageUrl);
      setField("idProofType", v.idProof);
      setField("idProofNumber", v.idProofNo);
      setField("idProofId", v.idProofId);
      setField("purpose", v.purpose);

      return true;
    } catch (e) {
      console.error("Visitor lookup failed", e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { lookupVisitor, loading };
}
