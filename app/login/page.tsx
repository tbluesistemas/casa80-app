import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex w-full items-end justify-center rounded-lg bg-primary p-3 md:h-20">
                    <h1 className="text-white text-3xl font-bold">Casa80</h1>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
