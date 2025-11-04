import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import User from '../models/User.js';
import Task from '../models/Task.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123'
    });
    console.log('Test user created:', testUser.email);

    // Create sample tasks
    const sampleTasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the project proposal document and send for review',
        status: 'completed',
        priority: 'high',
        tags: ['work', 'important'],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        user: testUser._id
      },
      {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, fruits and vegetables',
        status: 'pending',
        priority: 'medium',
        tags: ['personal', 'shopping'],
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        user: testUser._id
      },
      {
        title: 'Learn React Hooks',
        description: 'Complete the advanced React hooks tutorial',
        status: 'in-progress',
        priority: 'high',
        tags: ['learning', 'development'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        user: testUser._id
      },
      {
        title: 'Morning workout',
        description: '30 minutes of cardio and strength training',
        status: 'pending',
        priority: 'low',
        tags: ['health', 'routine'],
        user: testUser._id
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for weekly team meeting',
        status: 'pending',
        priority: 'medium',
        tags: ['work', 'meeting'],
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        user: testUser._id
      }
    ];

    await Task.insertMany(sampleTasks);
    console.log('Sample tasks created');

    console.log('\n✅ Seed data created successfully!');
    console.log('Test User Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: test123');
    
    process.exit(0);

  } catch (error) {
    console.error('Seed data error:', error);
    process.exit(1);
  }
};

seedData();