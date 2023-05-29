import { LoaderArgs, redirect } from '@remix-run/cloudflare';

export async function loader({ params }: LoaderArgs) {
	if (params?.NODE_ENV === 'PROD') {
		return redirect('/coming-soon');
	}
	if (params?.sessionId) {
		// fetch cart from session, if it exists
		console.log(params?.sessionId);
		return redirect('/order');
	}
	return null;
}

export default function Order() {
	return (
		<div>
			<div>Thanks for your order!</div>
		</div>
	);
}
