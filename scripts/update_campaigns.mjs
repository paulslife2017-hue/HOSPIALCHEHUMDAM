import { createClient } from '@libsql/client/http'

const db = createClient({
  url:       'libsql://seoul-beauty-trip-werwe.aws-ap-northeast-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3ODE0MjAzNzcsImlkIjoiMDE5ZWM0ZWQtYTYwMS03NjA5LTljYzQtOTYzZTVhOWUzM2U2IiwicmlkIjoiMDIwYWQ5NWEtZDFlMC00ZTVmLWIzNDgtMjFlMmY5NWMxMDk5In0.uVaG_hHWne4wtCeSiQ7cmiC_1gekUyTJdM0BtqpBSYBIKZ8irkbWoin1NQVIWp5m8_Wlg4LCWUtlA3YlqKDoBg'
})

// ─── ID 2: 본큐어한의원 (Bonecure Korean Medicine Clinic) ───────────────────
const bonecure = {
  title:        'Traditional Korean Medicine Experience in Gangnam',
  description:  'Located in the heart of Gangnam, Bonecure Korean Medicine Clinic specializes in traditional acupuncture, herbal medicine, and holistic wellness therapies. The clinic is fully equipped to treat international visitors — all consultations are available in English, and the experienced staff will tailor a personalized treatment plan just for you. Whether you are looking to relieve stress, improve circulation, or simply experience authentic Korean healing culture, Bonecure offers a serene and professional environment steps away from the busiest district in Seoul.',
  benefits:     'Complimentary acupuncture session (30 min) + full-body consultation + traditional herbal tea ceremony — total value ₩180,000',
  requirements: '1,000+ Instagram followers · Any nationality welcome · Post 1 Reel or Story within 2 weeks of visit · Tag @bonecure_official',
}

// ─── ID 1: Yonsei Midas Dental Clinic (기존 데이터 보강) ───────────────────
const yonsei = {
  title:        'Premium Dental Care at Incheon Airport',
  description:  'Yonsei Midas Dental Clinic is conveniently located on the 3rd floor of Sun Tower inside Incheon International Airport — the perfect opportunity to get world-class dental treatment before or after your flight. The clinic offers a full range of cosmetic and general dentistry including professional whitening, deep cleaning, scaling, implants, and smile makeovers. All dentists speak fluent English, appointments are available same-day, and the modern facility is equipped with the latest digital imaging technology. No more putting off dental care — make the most of your layover or trip to Korea.',
  benefits:     'Free dental consultation + professional scaling & cleaning + whitening session — total value ₩250,000',
  requirements: 'Any follower count welcome · English-language content preferred · Post 1 photo or Reel within 3 weeks · Tag @yonsei_midas',
}

async function run() {
  console.log('Updating ID 2 (Bonecure)…')
  await db.execute({
    sql: `UPDATE campaigns SET title=?, description=?, benefits=?, requirements=? WHERE id=2`,
    args: [bonecure.title, bonecure.description, bonecure.benefits, bonecure.requirements]
  })

  console.log('Updating ID 1 (Yonsei Midas)…')
  await db.execute({
    sql: `UPDATE campaigns SET title=?, description=?, benefits=?, requirements=? WHERE id=1`,
    args: [yonsei.title, yonsei.description, yonsei.benefits, yonsei.requirements]
  })

  // 확인
  const rs = await db.execute({ sql: 'SELECT id, title, description, benefits, requirements FROM campaigns ORDER BY id', args: [] })
  for (const row of rs.rows) {
    console.log(`\n[ID ${row.id}] ${row.title}`)
    console.log(`  DESC: ${String(row.description).slice(0,90)}…`)
    console.log(`  BEN:  ${row.benefits}`)
    console.log(`  REQ:  ${row.requirements}`)
  }
  console.log('\n✅ Done')
}

run().catch(e => { console.error('ERROR:', e.message); process.exit(1) })
