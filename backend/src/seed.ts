/**
 * Seed Script — Smart Leads Dashboard
 * ------------------------------------
 * Creates 1 admin user, 2 sales users, and 100 realistic leads.
 *
 * Usage (from the backend/ folder):
 *   npx ts-node src/seed.ts
 *
 * Or inside Docker:
 *   docker exec -it smart-leads-backend npx ts-node src/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// ─── Inline minimal models (avoids circular import issues in seed) ─────────────

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
}, { timestamps: true });

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'] },
  source: { type: String, enum: ['Website', 'Instagram', 'Referral'] },
  notes: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const firstNames = [
  'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Neha', 'Arjun', 'Pooja',
  'Rohan', 'Divya', 'Karan', 'Ananya', 'Siddharth', 'Meera', 'Aakash',
  'Shreya', 'Manish', 'Kavya', 'Rajesh', 'Simran', 'Deepak', 'Ishaan',
  'Nisha', 'Varun', 'Tanvi', 'Abhishek', 'Riya', 'Gaurav', 'Poonam',
  'Nikhil', 'Aditi', 'Sumit', 'Kriti', 'Harsh', 'Ankita', 'Vivek',
  'Swati', 'Tushar', 'Pallavi', 'Mohit',
];

const lastNames = [
  'Sharma', 'Verma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Mehta', 'Shah',
  'Joshi', 'Nair', 'Reddy', 'Iyer', 'Chopra', 'Malhotra', 'Kapoor',
  'Bose', 'Das', 'Mishra', 'Tiwari', 'Saxena', 'Pandey', 'Rao',
  'Sinha', 'Ghosh', 'Pillai',
];

const companies = [
  'Infosys', 'TCS', 'Wipro', 'HCL', 'Tech Mahindra', 'Zomato', 'Swiggy',
  'Paytm', 'Razorpay', 'BYJU\'s', 'Ola', 'Flipkart', 'Myntra', 'Nykaa',
  'Zepto', 'PhonePe', 'Meesho', 'Dream11', 'Unacademy', 'Freshworks',
];

const notesByStatus: Record<string, string[]> = {
  New: [
    'Just submitted a contact form on our website.',
    'Came through Instagram DM. Interested in pricing.',
    'Referred by an existing client. Yet to be contacted.',
    'Downloaded our product brochure.',
    'Attended our webinar last week.',
    'Reached out via LinkedIn. Needs follow-up.',
  ],
  Contacted: [
    'Had an intro call. Needs time to evaluate.',
    'Sent product deck via email. Awaiting response.',
    'Spoke on the phone. Wants a demo next week.',
    'Replied to cold email. Scheduling a call.',
    'Met at a conference. Exchanged details.',
    'WhatsApp conversation ongoing.',
  ],
  Qualified: [
    'Budget confirmed. Ready for proposal.',
    'Decision maker involved. High intent.',
    'Matches our ICP perfectly. Moving to contract.',
    'Requested custom pricing. Very interested.',
    'Completed product demo. Very positive feedback.',
    'Trial account created. Active usage observed.',
  ],
  Lost: [
    'Went with a competitor. Price sensitivity.',
    'Project put on hold indefinitely.',
    'No response after 5 follow-ups.',
    'Budget got cut for the quarter.',
    'Requirements changed. No longer a fit.',
    'Decision maker left the company.',
  ],
};

const statuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const sources = ['Website', 'Instagram', 'Referral'] as const;

// Weighted distribution so data looks realistic
const statusWeights = [35, 30, 20, 15]; // New=35%, Contacted=30%, Qualified=20%, Lost=15%
const sourceWeights = [45, 30, 25];     // Website=45%, Instagram=30%, Referral=25%

function weightedRandom<T>(items: readonly T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName: string, lastName: string, company: string): string {
  const domain = company.toLowerCase().replace(/[^a-z]/g, '') + '.com';
  const formats = [
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}@${domain}`,
    `${firstName.toLowerCase()}@${domain}`,
  ];
  return randomFrom(formats);
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return past;
}

// ─── Main Seed Function ───────────────────────────────────────────────────────

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-leads';

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('✅ Connected\n');

  // ── 1. Clear existing data ──────────────────────────────────────────────────
  console.log('🧹 Clearing existing leads and users...');
  await Lead.deleteMany({});
  await User.deleteMany({});
  console.log('✅ Cleared\n');

  // ── 2. Create users ─────────────────────────────────────────────────────────
  console.log('👤 Creating users...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: hashedPassword,
    role: 'admin',
  });

  const sales1 = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul@smartleads.com',
    password: hashedPassword,
    role: 'sales',
  });

  const sales2 = await User.create({
    name: 'Priya Patel',
    email: 'priya@smartleads.com',
    password: hashedPassword,
    role: 'sales',
  });

  const users = [admin, sales1, sales2];

  console.log('✅ Created 3 users:\n');
  console.log('   Role  : Admin');
  console.log('   Email : admin@smartleads.com');
  console.log('   Pass  : password123\n');
  console.log('   Role  : Sales');
  console.log('   Email : rahul@smartleads.com');
  console.log('   Pass  : password123\n');
  console.log('   Role  : Sales');
  console.log('   Email : priya@smartleads.com');
  console.log('   Pass  : password123\n');

  // ── 3. Generate 100 leads ───────────────────────────────────────────────────
  console.log('🌱 Seeding 100 leads...');

  const leads = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const firstName = randomFrom(firstNames);
    const lastName = randomFrom(lastNames);
    const company = randomFrom(companies);
    const status = weightedRandom(statuses, statusWeights);
    const source = weightedRandom(sources, sourceWeights);

    // Ensure unique emails
    let email = generateEmail(firstName, lastName, company);
    let attempt = 0;
    while (usedEmails.has(email)) {
      email = `${firstName.toLowerCase()}${attempt}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`;
      attempt++;
    }
    usedEmails.add(email);

    const note = randomFrom(notesByStatus[status]);
    const createdBy = randomFrom(users);
    const createdAt = randomDate(180); // within last 6 months

    leads.push({
      name: `${firstName} ${lastName}`,
      email,
      status,
      source,
      notes: note,
      createdBy: createdBy._id,
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Lead.insertMany(leads);

  // ── 4. Print summary ────────────────────────────────────────────────────────
  const statusCounts = await Lead.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const sourceCounts = await Lead.aggregate([
    { $group: { _id: '$source', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log('\n✅ 100 leads seeded successfully!\n');
  console.log('📊 Status breakdown:');
  statusCounts.forEach((s) => console.log(`   ${s._id.padEnd(12)}: ${s.count}`));
  console.log('\n📊 Source breakdown:');
  sourceCounts.forEach((s) => console.log(`   ${s._id.padEnd(12)}: ${s.count}`));

  console.log('\n🎉 Seed complete! You can now log in and demo the dashboard.\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
