import { Link, useLocation } from '@remix-run/react';

export default function Footer() {
    return (
        <div id="footer" className="flex-auto bg-primary px-24 py-6 text-white">
            <ul>
                <li>
                    <p className="text-xl font-bold">Hungry Tapir</p>
                </li>
                <li>
                    <Link to="/about">About Us</Link>
                </li>
                <li>
                    <Link to="/delivery">Deliveries & Returns</Link>
                </li>
                <li>
                    <Link to="/terms">Terms & Conditions</Link>
                </li>
                <li>
                    <p className="text-sm font-light">
                        Copyright Hungry Tapir LLP 2023
                    </p>
                </li>
            </ul>
        </div>
    );
}
