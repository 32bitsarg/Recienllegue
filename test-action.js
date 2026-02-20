import { getOndutyPharmacies } from "./src/app/actions/data.js";

async function test() {
    const data = await getOndutyPharmacies();
    console.log(JSON.stringify(data, null, 2));
}

test();
