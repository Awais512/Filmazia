"use server";

import { createClient } from "@/features/auth/utils/supabase-server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const avatarValue = formData.get("avatar_url") ?? formData.get("avatar");
  const avatarUrl =
    typeof avatarValue === "string" && avatarValue.trim().length > 0
      ? avatarValue.trim()
      : null;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/auth/callback`,
      data: {
        name: name || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  const userId = data.user?.id;
  const userEmail = data.user?.email ?? email;

  if (!userId || !userEmail) {
    return { error: "User creation failed" };
  }

  try {
    await db
      .insert(users)
      .values({
        id: userId,
        email: userEmail,
        name,
        avatarUrl,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userEmail,
          name,
          avatarUrl,
          updatedAt: new Date(),
        },
      });
  } catch {
    return { error: "Failed to create user profile" };
  }

  return { success: true };
}
