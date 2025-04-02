"use server";

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthError } from "next-auth";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: "please select a customer" }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter a amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
          UPDATE invoices
          SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
          WHERE id = ${id}
        `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice",
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  // More detailed logging of the raw formData
  console.log("Raw formData keys:", [...formData.keys()]);
  console.log("Raw formData values:", [...formData.values()]);

  // Try accessing input fields directly with alternate methods
  console.log("Direct email value:", formData.get("email"));
  console.log("Using getAll for email:", formData.getAll("email"));

  // Rest of your function remains the same...
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  console.log("Authentication attempt with:", {
    email,
    password: password
      ? "Password provided (not showing value)"
      : "No password",
    redirectTo,
  });

  try {
    console.log("Calling signIn with credentials...");
    await signIn("credentials", {
      email: email,
      password: password,
      redirectTo: typeof redirectTo === "string" ? redirectTo : undefined,
      redirect: false, // Prevent automatic redirects so we can handle errors
    });
    console.log("Authentication successful");
    return undefined; // No error on success
  } catch (error) {
    console.error("Authentication error:", error);

    if (error instanceof AuthError) {
      console.error("AuthError type:", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password. Please try again.";
        default:
          return "Something went wrong. Please try again.";
      }
    }
    return "An unexpected error occurred. Please try again.";
  }
}

export async function signInWithGoogle() {
  return signIn("google");
}
