import NextAuth, { type AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import Credentials from "next-auth/providers/credentials";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function getTransport() {
  if (!process.env.SMTP_HOST || process.env.USE_ETHEREAL === "1") {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const authConfig: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  providers: [
    EmailProvider({
      sendVerificationRequest: async ({ identifier, url }) => {
        const transport = await getTransport();
        const result = await transport.sendMail({
          to: identifier,
          from: (process.env.EMAIL_FROM as string) ?? "no-reply@example.com",
          subject: "Your sign-in link",
          html: `<p>Click to sign in:</p><p><a href="${url}">${url}</a></p>`,
          text: `Sign in: ${url}`,
        });
        if (!result.accepted?.length) {
          throw new Error("Email not accepted by SMTP");
        }
        const preview = nodemailer.getTestMessageUrl(result);
        if (preview) console.log("Magic link preview URL:", preview);
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        if (!email || !password) return null;
        const user = await prisma.user.findUnique({ 
          where: { email }, 
          select: { id: true, email: true, name: true, role: true, passwordHash: true } 
        });
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }: { session: any; user?: any; token?: any }) {
      if (session.user) {
        // For email sign-in via adapter 'user' is defined; for credentials it's on token
        const role = user?.role ?? token?.role ?? "borrower";
        session.user.role = role;
        session.user.id = user?.id ?? token?.id;
      }
      return session;
    },
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
