import type { ActionArgs, LoaderArgs } from '@remix-run/cloudflare';

export async function loader({ context }: LoaderArgs) {
  return null;
}

export async function action({ request, context }: ActionArgs) {
  // Handle Add To Bag action
  const formData = await request.formData();

  // Validate form data TODO

  // Extract slug and quantity from form data
  console.log(formData);

  return { state: 'success' };
}

export default function Checkout() {
  return (
    <div>
      <h1>Checkout</h1>
    </div>
  );
}
