import { cookies } from "next/headers";
import Manager from "./Manager";

export default async function Live() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  return <Manager token={token} />;
}
