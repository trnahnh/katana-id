import { useAuthStore } from "@/store/useAuthStore";
import VerificationOverlay from "./VerificationOverlay";

interface RequireVerifiedProps {
  children: React.ReactNode;
}

export default function RequireVerified({ children }: RequireVerifiedProps) {
  const { authUser } = useAuthStore();

  // When user is not logged in
  if (!authUser) {
    return <>{children}</>;
  }

  // When email is not verified
  if (!authUser.email_verified) {
    return (
      <div className="relative min-h-full">
        <div className="pointer-events-none blur-xs opacity-50">{children}</div>
        <VerificationOverlay email={authUser.email} />
      </div>
    );
  }

  // When email is verified
  return <>{children}</>;
}
