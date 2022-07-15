import { exec } from '@actions/exec';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import { GitHubContext } from '@tangro/tangro-github-toolkit';
import path from 'path';
import * as core from '@actions/core';

export async function runLicenseCheck({
  context,
  failLicenses,
  subDir
}: {
  context: GitHubContext<{}>;
  failLicenses: string;
  subDir: string;
}) {
  const [owner, repo] = context.repository.split('/');

  let stdout = '';
  let stderr = '';

  const options: ExecOptions = {
    ignoreReturnCode: true,
    cwd: path.join(process.env.RUNNER_WORKSPACE as string, repo, subDir),
    listeners: {
      stdout: data => {
        stdout += data.toString();
      },
      stderr: data => {
        stderr += data.toString();
      }
    }
  };

  core.info(`CWD: ${options.cwd}`)

  await exec(
    'npx',
    [
      '-q',
      'license-checker',
      '--production',
      '--json',
      `--failOn='${failLicenses}'`
    ],
    options
  );

  if (stderr.length > 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
