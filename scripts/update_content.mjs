import { createClient } from '@libsql/client/http'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

// ── ID 1: Yonsei Midas Dental Clinic ──────────────────────────────────────
const desc1 = `Nestled on the 3rd floor of Sun Tower inside Incheon International Airport, Yonsei Midas Dental Clinic transforms your layover into a luxury wellness moment. Whether you have 90 minutes between flights or are arriving fresh into Korea, this is your chance to experience world-class Korean dentistry without ever leaving the airport. The clinic's board-certified dentists speak fluent English and offer a full suite of cosmetic and general treatments — from professional whitening and precision scaling to same-day implants and full smile makeovers. State-of-the-art 3D digital imaging ensures pinpoint accuracy, while the sleek, modern interior makes every visit feel effortlessly premium. No waiting weeks for an appointment — walk in, get treated, and fly out with a brighter smile.`

const ben1 = `Complimentary express dental consultation · Professional scaling & deep cleaning · Teeth whitening treatment session`

const req1 = `Open to all follower counts · English or travel-focused content preferred · 1 feed post or Reel within 3 weeks of your visit · Tag @yonsei_midas and mention Incheon Airport location`

// ── ID 2: Bonecure Korean Medicine Clinic ─────────────────────────────────
const placeName2 = `본큐어한의원 BONECURE KOREAN MEDICINE CLINIC`

const title2 = `Authentic Korean Medicine & Wellness in the Heart of Gangnam`

const desc2 = `Tucked in the vibrant streets of Gangnam, Bonecure Korean Medicine Clinic is where centuries-old healing tradition meets modern clinical expertise. Specializing in acupuncture, cupping therapy, manual therapy (도수치료), and bespoke herbal medicine, the clinic welcomes international visitors with full English consultations and a warm, unhurried atmosphere. Each session begins with a one-on-one diagnostic consultation — your practitioner will assess your body's balance and craft a personalized treatment plan tailored to your needs. Whether you are recovering from travel fatigue, managing chronic pain, or simply curious about the healing arts of Korea, Bonecure delivers a deeply restorative experience that goes far beyond a typical spa visit.`

const ben2 = `Complimentary 30-minute acupuncture session · Full-body wellness consultation · Traditional Korean herbal tea ceremony`

const req2 = `1,000+ Instagram followers · Any nationality welcome · 1 Reel or Story posted within 2 weeks of visit · Tag @bonecure_official · Mention the treatment experienced`

// ── Run Updates ───────────────────────────────────────────────────────────
async function run() {
  console.log('Updating ID 1 — Yonsei Midas Dental Clinic...')
  await db.execute({
    sql: `UPDATE campaigns SET description = ?, benefits = ?, requirements = ? WHERE id = 1`,
    args: [desc1, ben1, req1],
  })

  console.log('Updating ID 2 — Bonecure Korean Medicine Clinic...')
  await db.execute({
    sql: `UPDATE campaigns SET place_name = ?, title = ?, description = ?, benefits = ?, requirements = ? WHERE id = 2`,
    args: [placeName2, title2, desc2, ben2, req2],
  })

  // ── Verify ───────────────────────────────────────────────────────────────
  const result = await db.execute('SELECT id, place_name, title, benefits, requirements FROM campaigns')
  result.rows.forEach(row => {
    console.log(`\n✅ ID ${row.id} | ${row.place_name}`)
    console.log('   title:', row.title)
    console.log('   benefits:', row.benefits)
    console.log('   requirements:', row.requirements)
  })
  console.log('\n🎉 All updates applied successfully!')
}

run().catch(e => { console.error('❌ Error:', e); process.exit(1) })
