
export const user = {
  username: 'TestUser',
  id: 1,
  firstName: 'Test',
  lastName: 'User',
  email: 'test@user.tt'
};

let tokenChars = 'abcdef1234567890';
let size = tokenChars.length;

export const generateToken = () => {
  let token = '';
  for (let i = 0; i < 30; i++) {
    token += tokenChars[Math.floor(Math.random() * size)];
  }
  return token;
}
