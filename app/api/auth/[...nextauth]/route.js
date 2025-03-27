import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";

export const Authoptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.OAUTH_CLIENT,
      clientSecret: process.env.OAUTH_SECRET,
    }),
  ],
  secret: '48d5c4d9913e4cb1abcf3f6a05a86b3c',
  callbacks: {
    async signIn({ profile }) {
      console.log('hello');
      if (!profile || !profile.email) return false;
      const token = jsonwebtoken.sign({ email: profile.email,name: profile.name,image: profile.picture },process.env.JWTSECRET);
      return `/api/callback/${token}`;
    },
  },
};

const handler = NextAuth(Authoptions);
export { handler as GET, handler as POST };
