import { AuthLayout } from "@/components/auth-layout";
import { SignInForm } from "@/components/sign-in-form";
import { Suspense } from "react";

export default function SignInPage() {
   return (
      <AuthLayout>
         <Suspense>
            <SignInForm />
         </Suspense>
      </AuthLayout>
   );
}
