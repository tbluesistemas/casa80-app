import { LoginForm } from '@/components/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login',
};

export default function LoginPage() {
    return (
        <main className="flex items-center justify-center min-h-screen px-4 py-8">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 md:-mt-32">
                <div className="flex flex-col w-full items-center justify-center rounded-lg bg-primary/5 p-4 sm:p-6 border border-primary/10 min-h-[160px] md:h-48 gap-3">
                    <img src="/logo.png" alt="Casa80 Logo" className="h-20 sm:h-28 md:h-32 w-auto object-contain" />
                    <p className="text-primary/80 text-[13px] sm:text-[15px] uppercase font-bold tracking-widest text-center">
                        El ALIADO perfecto para tus eventos!
                    </p>
                </div>
                <LoginForm />
            </div>
        </main>
    );
}
