// populate.js
const mongoose=require('mongoose')
const { Candidate } = require('../models/Candidate');
const MONGODB_URI = 'process.env.DB_URI/candidates';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const candidatesData = [
  {
    sno: 1,
    name: 'B.Sai Jyothi',
    role: 'Faculty Sponsor',
    imageSrc: 'https://acm.vvitguntur.com/images/team/acm-w-17-18/faculty-coordinator.jpg',
  },
  {
    sno: 2,
    name: 'M.Lakshmi Sahitya',
    role: 'Chair',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/1sahithya.jpg',
  },
  {
    sno: 3,
    name: 'Ch.Suma Sri',
    role: 'Vice Chair',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/2suma.jpg',
  },
  {
    sno: 4,
    name: 'M.Sai Jasmine',
    role: 'Web Master',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/4jasmine.jpg',
  },
  {
    sno: 5,
    name: 'K.Niharika',
    role: 'Secretary',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/3niharika.jpg',
  },
  {
    sno: 6,
    name: 'N.Naga Likitha',
    role: 'Treasurer',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/5likitha2.png',
  },
  {
    sno: 7,
    name: 'K.Veera Sai Sindhu',
    role: 'Membership Chair',
    imageSrc: 'https://acm.vvitguntur.com/images/acm2023-24/acm_officers/acm_w/6sindhu.jpg',
  },
  // Add more candidates as needed
];

async function populateDatabase() {
  try {
    
    await Candidate.insertMany(candidatesData);
    console.log('Database populated successfully.');
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    process.exit();
  }
}

populateDatabase();
