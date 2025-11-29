import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingScreen from "@/components/landing/LandingScreen";

export default async function Home() {
    const { userId } = await auth();

    if (userId) {
        redirect("/dashboard");
    }

    return <LandingScreen />;
}
