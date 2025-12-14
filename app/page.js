import {redirect } from "next/navigation";
export default function Home()
{
  redirect("/api_containers/company/profile");
}