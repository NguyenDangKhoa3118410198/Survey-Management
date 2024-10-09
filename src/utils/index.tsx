export const customizeRequiredMark = (
  label: React.ReactNode,
  { required }: { required: boolean }
) => (
  <>
    {label && (
      <span style={{ width: '150px', textAlign: 'left' }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </span>
    )}
  </>
);

export const generateRandomPassword = (length = 8) => {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialCharacters = '!@#$%^&*()_+[]{}|;:,.<>?';
  const numbers = '0123456789';

  const passwordArray = [
    lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)],
    upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)],
    specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
  ];

  const allCharacters =
    lowerCaseLetters + upperCaseLetters + specialCharacters + numbers;

  for (let i = passwordArray.length; i < length; i++) {
    passwordArray.push(
      allCharacters[Math.floor(Math.random() * allCharacters.length)]
    );
  }

  const shuffledPassword = passwordArray
    .sort(() => 0.5 - Math.random())
    .join('');

  return shuffledPassword;
};
