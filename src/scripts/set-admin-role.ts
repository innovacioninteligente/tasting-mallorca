import 'dotenv/config';
import { assignRole } from '@/backend/users/application/assignRole';
import { UserRole } from '@/backend/users/domain/user.model';
import { adminApp } from '@/firebase/server/config';

// Initialize Firebase Admin SDK to ensure it's ready.
adminApp;

async function setAdminRole() {
  const email = process.argv[2];
  const uid = process.argv[3];

  if (!email || !uid) {
    console.error('Error: Please provide an email address and a UID as arguments.');
    console.log('Usage: npm run set-admin <email> <uid>');
    process.exit(1);
  }

  console.log(`Attempting to assign 'admin' role to ${email} (UID: ${uid})...`);

  try {
    await assignRole(uid, 'admin' as UserRole);
    console.log(`✅ Successfully assigned 'admin' role to ${email}.`);
    console.log("You can now remove the 'src/scripts' directory and the 'set-admin' script from package.json.");
  } catch (error) {
    console.error('❌ Failed to assign admin role:');
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error(error);
    }
    process.exit(1);
  }
}

setAdminRole().then(() => {
    process.exit(0);
});
