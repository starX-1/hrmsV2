// app/api/auth/[...nextauth]/authOptions.ts
import hrmsApi from '../../../utils/axios';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const { data } = await hrmsApi.post('/employees/login', {
                        email: credentials?.email,
                        password: credentials?.password,
                    });
                    console.log('Credentials login data:', credentials);
                    console.log('Credentials login response:', data);
                    const { token, user, permissions } = data;

                    if (token && user) {
                        // Return the complete response as the user object
                        return {
                            id: user.id.toString(),
                            email: user.email,
                            name: `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.email,
                            // Store the complete API response
                            apiResponse: {
                                message: data.message,
                                token: token,
                                user: user,
                                permissions: permissions || []
                            }
                        };
                    }
                    return null;
                } catch (err) {
                    console.error('Credentials login error:', err?.response?.data || err?.message);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: '/login',
        error: '/login',
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Store the complete API response in the token
                token.apiResponse = user.apiResponse;
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },

        async session({ session, token }) {
            // Return the complete API response in the session
            if (token?.apiResponse) {
                session.apiResponse = token.apiResponse;
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.name = token.name;
                session.accessToken = token.apiResponse.token;
            }
            return session;
        },
    },

    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};

export { authOptions };