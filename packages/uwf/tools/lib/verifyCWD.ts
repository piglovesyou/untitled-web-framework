import path from 'path';

export default function verifyCWD() {
  // @ts-ignore
  const pkgPath = path.resolve(process.env.INIT_CWD, 'package.json');
  let pkg;
  try {
    pkg = require(pkgPath);
    if (pkg.devDependencies || pkg.devDependencies.uwd) {
      return;
    }
  } catch (e) {
    throw new Error(
      'You have to run uwf command on your project root where package.json are located.',
    );
  }
  throw new Error("Your package.json doesn't contain devDependencies.uwf .");
}
