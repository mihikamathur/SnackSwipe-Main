import path from 'path';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import Item from '../modals/item.js';

const uploadsDir = path.join(process.cwd(), 'uploads');

const inferName = (filename) => {
 
  const parts = filename.split('-');
  const nameWithExt = parts.slice(1).join('-') || parts[0];
  const name = nameWithExt.replace(path.extname(nameWithExt), '').replace(/[-_]/g, ' ');
 
  return name.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
};

const main = async () => {
  await connectDB();

  try {
    const files = await fs.readdir(uploadsDir);
    if (!files.length) {
      console.log('No files in uploads directory');
      process.exit(0);
    }

    for (const file of files) {
    
      if (file.startsWith('.')) continue;

      const name = inferName(file);
      const existing = await Item.findOne({ name });
      if (existing) {
        console.log(`Skipping existing item: ${name}`);
        continue;
      }

      const imageUrl = `/uploads/${file}`; 
      const price = Math.floor(Math.random() * 200) + 50;
      const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
      const hearts = Math.floor(Math.random() * 300) + 10;
      const category = 'Uncategorized';

      const newItem = new Item({
        name,
        description: `${name} - delicious and freshly prepared.`,
        category,
        price,
        rating,
        hearts,
        imageUrl,
      });

      await newItem.save();
      console.log('Inserted item:', name);
    }

    console.log('Seeding finished');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

main();
