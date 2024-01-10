import Head from 'next/head';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {

	return (
		<>
			<Head>
				<title>Sign Up</title>
			</Head>

			<main className="fixed flex items-center justify-center w-full min-h-screen p-2">
				<SignUp
					path="/auth/sign-up"
					routing="path"
					afterSignUpUrl='/auth/sign-in'
					appearance={{
						elements: {},
					}}
				 />
			</main>
		</>
	);
}