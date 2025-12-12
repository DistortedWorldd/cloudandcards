# Firebase Setup Guide

Follow these steps to enable shared products across all users:

## Step 1: Create Firebase Account
1. Go to https://console.firebase.google.com/
2. Click 'Add project'
3. Enter project name: 'cloud-and-cards'
4. Disable Google Analytics
5. Click 'Create project'

## Step 2: Set Up Firestore Database
1. Click 'Firestore Database' in left menu
2. Click 'Create database'
3. Select 'Start in production mode'
4. Choose location: europe-west2 (London)
5. Click 'Enable'

## Step 3: Configure Security Rules
1. In Firestore, click 'Rules' tab
2. Replace rules with:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
      allow write: if true;
    }
    match /submissions/{submission} {
      allow read, write: if true;
    }
  }
}

3. Click 'Publish'

## Step 4: Get Config Keys
1. Project Settings (gear icon)
2. Scroll to 'Your apps'
3. Click web icon
4. Register app: 'cloud-and-cards-web'
5. Copy the firebaseConfig object

## Step 5: Add Keys
1. Open firebase-config.js
2. Replace YOUR_API_KEY_HERE etc with your actual values

## Done!
Upload to Netlify and products will be shared!
