"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardWrapper } from "./card-wrapper";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { title } from "../fonts/font";

export const LoginForm = () => {
  const router = useRouter();
  // const urlError =
  //   searchParams.get("error") === "OAuthAccountNotLinked"
  //     ? "Email already in use with different provider!"
  //     : "";

  // const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          form.reset();
          setError(data.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data?.success);
          router.refresh();
        }

        // if (data?.twoFactor) {
        //   setShowTwoFactor(true);
        // }
      });
      // .catch(() => {
      //   setError("Something went wrong!");
      // });
    });
  };

  return (
    <CardWrapper
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
      headerLabel={""}
    >
      <Separator className="my-2"/>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            {/* {showTwoFactor && ( */}
            {/* <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            {/* // )}
            // {!showTwoFactor && ( */}
            {/* //   <> */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@dev.gov.ph"
                      disabled={isPending}
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="******"
                      disabled={isPending}
                    />
                  </FormControl>
                  {/* <Button
                    size={"sm"}
                    variant={"link"}
                    className="px-0 font-normal"
                    asChild
                  >
                    <Link href="/auth/reset">Forgot password?</Link>
                  </Button> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* //   </>
            // )} */}
          </div>
          <FormError
            message={error}
            // || urlError}
          />
          <FormSuccess message={success} />
          <Button type="submit" className={cn("w-full uppercase", title.className)} disabled={isPending}>
            {/* {showTwoFactor ? "Confirm" : "Login"} */}
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
