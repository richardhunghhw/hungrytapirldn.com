/**
 * linkinbio page for Socials, QR code...
 * Todo: page
 */

import { redirect } from '@remix-run/cloudflare';

export async function loader() {
    return redirect('/');
}
