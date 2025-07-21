const mongoose = require('mongoose');
const TeamMember = require('../models/teamSchema');

const seedTeam = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  
  await TeamMember.deleteMany();

  await TeamMember.insertMany([
    {
      name: 'Olusola Adebayo Oguntuase',
      role: 'Chief Executive Officer',
      image: '/managementImage/mnbImg2.png',
      linkedin: 'https://www.linkedin.com/in/olusola-oguntuase-779069353/',
      twitter: 'https://x.com/MNBlog25',
      instagram: 'https://www.instagram.com/phonkey_n/',
      quote: 'Empowering ideas to shape the future.'
    },
    {
      name: 'Olusola Adebayo Oguntuase',
      role: 'Chief Technology Officer',
      image: '/managementImage/mnbImg3.png',
      linkedin: 'https://www.linkedin.com/in/olusola-oguntuase-779069353/',
      twitter: 'https://x.com/MNBlog25',
      instagram: 'https://www.instagram.com/phonkey_n/',
      quote: 'Technology is best when it brings people together.'
    },
    {
      name: 'Oluwadamilola Adebayo',
      role: 'Head of Marketing',
      image: '/managementImage/managementImg1.jpg',
      linkedin: 'https://linkedin.com/in/charlielee',
      twitter: 'https://twitter.com/charlielee',
      instagram: 'https://instagram.com/charlielee',
      quote: 'Creativity fuels the culture that builds brands.'
    }
  ]);

  console.log('✅ Team data seeded');
  process.exit();
};

seedTeam().catch(err => {
  console.error(err);
  process.exit(1);
});
