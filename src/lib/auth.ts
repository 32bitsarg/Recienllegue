import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                identifier: { label: "Email o Usuario", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error("Credenciales inválidas");
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    }
                });

                if (!user || !user.passwordHash) {
                    throw new Error("Usuario no encontrado");
                }

                if (user.active === false) {
                    throw new Error("Tu cuenta ha sido suspendida. Contacta a soporte.");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                );

                if (!isPasswordCorrect) {
                    throw new Error("Contraseña incorrecta");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    username: user.username,
                    role: user.role,
                    bio: user.bio,
                    campus: user.campus,
                    gradYear: user.gradYear,
                    phone: user.phone,
                    avatarSeed: user.avatarSeed
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
                token.role = (user as any).role;
                token.bio = (user as any).bio;
                token.campus = (user as any).campus;
                token.gradYear = (user as any).gradYear;
                token.phone = (user as any).phone;
                token.avatarSeed = (user as any).avatarSeed;
            }
            // Always refresh role and active status from DB to pick up changes
            if (token.id) {
                try {
                    const dbUser = await prisma.user.findUnique({
                        where: { id: token.id as string },
                        select: { role: true, active: true }
                    });
                    if (dbUser) {
                        if (dbUser.active === false) {
                            return null as any; // Invalidate session
                        }
                        token.role = dbUser.role;
                    }
                } catch (e) {
                    // Silently fail — keep existing token role
                }
            }
            if (trigger === "update" && session) {
                return { ...token, ...session?.user };
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).username = token.username;
                (session.user as any).role = token.role;
                (session.user as any).bio = token.bio;
                (session.user as any).campus = token.campus;
                (session.user as any).gradYear = token.gradYear;
                (session.user as any).phone = token.phone;
                (session.user as any).avatarSeed = token.avatarSeed;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
