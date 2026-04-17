import { createClient } from 'matecitodb'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const URL = process.env.NEXT_PUBLIC_MATECITODB_URL
const SERVICE_KEY = process.env.MATECITODB_SERVICE_KEY

const db = createClient(URL, { apiKey: SERVICE_KEY, apiVersion: 'v2' })

async function run() {
  const existing = await db.from('eventos').limit(500).find()
  let malformed = 0
  for (const ev of existing) {
    if (ev.data && Object.keys(ev).length <= 4) {
      await db.from('eventos').eq('id', ev.id).hardDelete()
      malformed++
      console.log(`Borrando malformado: ${ev.id}`)
    }
  }
  console.log(`Total borrados: ${malformed}`)
}
run()
