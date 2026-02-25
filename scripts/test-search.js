import { searchClaimableBusinesses } from '../src/app/actions/data.js';

async function test() {
    console.log("Testing search for 'Toscana'...");
    const results = await searchClaimableBusinesses("Toscana");
    console.log("Results:", JSON.stringify(results, null, 2));
}

test().catch(console.error);
