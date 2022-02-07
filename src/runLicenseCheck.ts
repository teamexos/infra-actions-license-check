import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import { GitHubContext } from '@tangro/tangro-github-toolkit';
import path from 'path';

export async function runLicenseCheck({
  context,
  allowedLicenses
}: {
  context: GitHubContext<{}>;
  allowedLicenses: string;
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
      `--onlyAllow=${allowedLicenses},
      --excludePackages='prince-dev-tools@0.0.5;prince-sdk@2.2.0;cli-color@0.1.7'`
    ],
    options
  );

  if (stderr.length > 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
