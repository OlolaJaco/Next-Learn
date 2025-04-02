"use client";

import { lusitana } from '@/app/ui/fonts';
// import {
//   AtSymbolIcon,
//   KeyIcon,
//   ExclamationCircleIcon,
// } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from './button';
import { useActionState } from 'react';
import { authenticate, signInWithGoogle } from '@/app/lib/actions';
// import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined as string | undefined);



  return (
    <section className='flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md'>
      <form
        action={signInWithGoogle}
      >
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <button type="submit" className="w-full flex items-center justify-center gap-2 bg-white py-2 px-4 border rounded-md hover:bg-gray-50">
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            {/* Google logo SVG here */}
          </svg>
          Sign in with Google
        </button>
      </form>

      {/* The section is for email login but its throwing errors so i commented it out */}


      {/* <div className="my-4 flex items-center">
        <div className="h-px flex-1 bg-gray-200"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="h-px flex-1 bg-gray-200"></div>
      </div>

      <form className="space-y-3" action={formAction} onSubmit={handleSubmit}>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <div className="w-full">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
          <input type="hidden" name='redirectTo' value={callbackUrl} />

          {errorMessage && (
            <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p>{errorMessage}</p>
            </div>
          )}

          <Button type="submit" className="mt-4 w-full" aria-disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'} <ArrowRightIcon className="ml-auto h-5 w-5" />
          </Button>
        </div>
      </form> */}
    </section>
  );
}
