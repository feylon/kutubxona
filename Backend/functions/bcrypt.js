import bcrypt from "bcrypt";

function hash(str) {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(str, salt);
  return hash;
}

function check_hash(str, hash) {
  let check = bcrypt.compareSync(str, hash);
  return check;
}

export { hash, check_hash };