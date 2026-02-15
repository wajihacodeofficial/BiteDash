const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;

const testPasswords = [
  'Password123',   // Should be valid
  '12345678',      // Invalid (no letters)
  'password',      // Invalid (no numbers)
  'Pass123',       // Invalid (too short)
  'Password123!',  // Invalid (contains symbol, but regex restricts to alphanumeric)
];

testPasswords.forEach(pw => {
  console.log(`Testing "${pw}": ${passwordRegex.test(pw)}`);
});

const fixedRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
console.log('\nTesting fixed regex:');
testPasswords.forEach(pw => {
  console.log(`Testing "${pw}": ${fixedRegex.test(pw)}`);
});
