"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
  
    if (error) {
      console.error(error.code + " " + error.message);
      return encodedRedirect("error", "/", error.message);
    } else {
      return encodedRedirect(
        "success",
        "/",
        "กรุณาตรวจสอบอีเมลของท่านเพื่อรับลิงก์ยืนยันการลงทะเบียน",
      );
    }
  } 
};

// export const signInAction = async (formData: FormData) => {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const supabase = await createClient();

//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) {
//     return encodedRedirect("error", "/", error.message);
//   }

//   return redirect("/protected");
// };


export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // Attempt to sign in with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/", error.message); // Handle login failure
  }

  // Fetch the role data based on email
  const { data: userRoleData, error: roleError } = await supabase
    .from("role")
    .select("form")
    .eq("email", email) // Find the user's role by email
    .single(); // Ensure we get only one result (since email is unique)

  if (roleError) {
    console.error("Error fetching role data:", roleError.message);
    return encodedRedirect("error", "/", "Failed to fetch role data");
  }

  // Check if 'form' is false and redirect to /form
  if (userRoleData?.form === false) {
    return redirect("/form"); // Redirect to home if form is false
  }

  // Proceed with the normal redirection if 'form' is true
  return redirect("/home"); // Redirect to main if form is true
};


export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      // "Password update failed",
      "Password is too short.",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const fetchRolesAction = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("role").select("*");

  if (error) {
      console.error("Error fetching roles:", error.message);
      throw new Error("Failed to fetch roles.");
  }

  return data; // This can be returned directly or passed to a client component
};