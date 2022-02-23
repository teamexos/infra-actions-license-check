import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import { GitHubContext } from '@tangro/tangro-github-toolkit';
import path from 'path';

export async function runLicenseCheck({
  context,
  failLicenses
}: {
  context: GitHubContext<{}>;
  failLicenses: string;
}) {
  const [owner, repo] = context.repository.split('/');

  let stdout = '';
  let stderr = '';

  const options: ExecOptions = {
    ignoreReturnCode: true,
    cwd: path.join(process.env.RUNNER_WORKSPACE as string, repo),
    listeners: {
      stdout: data => {
        stdout += data.toString();
      },
      stderr: data => {
        stderr += data.toString();
      }
    }
  };

  await exec(
    'npx',
    [
      '-q',
      'license-checker',
      '--production',
      '--json',
<<<<<<< HEAD
      `--failOn=${failLicenses},
      --excludePackages='prince-backend@0.0.0;prince-mobile@1.0.14;prince-dev-tools@0.0.5;prince-sdk@2.2.0;prince-sdk@2.1.0;cli-color@0.1.7'`
=======
      `--onlyAllow=${allowedLicenses},
      --excludePackages='prince-backend@0.0.0;prince-mobile@1.0.14;prince-dev-tools@0.0.5;prince-sdk@2.2.0;prince-sdk@2.1.0;cli-color@0.1.7;@teamexos/playbook'`
>>>>>>> ad2ecbb9a38062efd66f21fe2272cb57ae9408d4
    ],
    options
  );

  if (stderr.length > 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
