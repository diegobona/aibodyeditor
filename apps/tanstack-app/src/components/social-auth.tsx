import { useState } from "react";
import {
  SocialButton,
  type SocialProvider,
} from "@libs/react-shared/ui/social-button";
import { cn } from "@libs/ui/utils/cn";
import { authClientReact } from "@libs/auth/authClient";
import { useTranslation } from "@/hooks/use-translation";
import { toast } from "sonner";

interface SocialAuthProps extends React.HTMLAttributes<HTMLDivElement> {
  providers?: SocialProvider[];
}

// WeChat / phone (China-only) login pages were removed for the US/EU audience.
const defaultProviders: SocialProvider[] = [
  "google",
  "github",
];

export function SocialAuth({
  className,
  providers = defaultProviders,
  ...props
}: SocialAuthProps) {
  const { t } = useTranslation();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(
    null
  );

  const handleProviderClick = async (provider: SocialProvider) => {
    if (loadingProvider) return;

    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    setLoadingProvider(provider);

    try {
      const callbackURL = returnTo
        ? `${window.location.origin}${returnTo}`
        : undefined;
      const { error } = await authClientReact.signIn.social({
        provider,
        ...(callbackURL && { callbackURL }),
      });

      if (error) {
        console.error("Social login error:", error);
        toast.error(error.message || t.common.unexpectedError);
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)} {...props}>
      {providers.map((provider) => (
        <SocialButton
          key={provider}
          provider={provider}
          onClick={() => handleProviderClick(provider)}
          loading={loadingProvider === provider}
          disabled={loadingProvider !== null && loadingProvider !== provider}
        />
      ))}
    </div>
  );
}
