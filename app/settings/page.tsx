import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEmailButton } from "@/app/settings/ActionButtons";

export default async function Settings() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (!profile) {
    return redirect("/login");
  }

  return (
    <Card className="w-full max-w-3xl m-auto">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">First name</Label>
              <Input
                id="name"
                defaultValue={profile.first_name}
                placeholder="Enter your first name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Last name</Label>
              <Input
                id="name"
                defaultValue={profile.last_name}
                placeholder="Enter your last name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled
                id="email"
                defaultValue={user.email}
                placeholder="Enter your email"
                type="email"
              />
              <ChangeEmailButton />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Password</Label>
              <Input
                disabled
                id="email"
                defaultValue={"thisisapassword!!!"}
                placeholder="Enter your email"
                type="password"
              />
              <Button variant={"outline"} size={"sm"}>
                Change password
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Profile picture</Label>
              {profile.profile_picture && (
                <img
                  alt="Profile picture"
                  className="rounded-full"
                  height={200}
                  src={profile.profile_picture}
                  style={{
                    aspectRatio: "200/200",
                    objectFit: "cover",
                  }}
                  width={200}
                />
              )}
              <div className="mt-2">
                <Button size="sm" variant="outline">
                  Upload new picture
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between w-full">
        <Button
          variant="outline"
          className={"text-destructive border-destructive"}
        >
          Delete account
        </Button>
        <Button type="submit">Save</Button>
      </CardFooter>
    </Card>
  );
}
