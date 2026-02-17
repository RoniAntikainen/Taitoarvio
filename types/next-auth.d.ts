import "next-auth";

declare module "next-auth" {
  interface Session {
    subscription?: {
      status?: "FREE" | "TRIAL" | "ACTIVE" | "PAST_DUE" | "CANCELED";
      trialEndsAt?: string | Date | null;
      currentPeriodEnd?: string | Date | null;
    };
  }
}
