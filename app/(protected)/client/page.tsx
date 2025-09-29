"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ClientForm } from "./_components/client-form";

const ClientPage = () => {
  const user = useCurrentUser();

  return (
    <ClientForm user={user} label="Travel Order Form" />
    /* <UserInfo user={user} label="Client component" />;  */
  );
};

export default ClientPage;
