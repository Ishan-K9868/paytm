import { spawn } from 'node:child_process';
import process from 'node:process';

function spawnNpm(scriptName) {
  if (process.platform === 'win32') {
    return spawn('cmd.exe', ['/d', '/s', '/c', `npm run ${scriptName}`], {
      stdio: 'inherit',
      env: process.env,
    });
  }

  return spawn('npm', ['run', scriptName], {
    stdio: 'inherit',
    env: process.env,
  });
}

const server = spawnNpm('dev:server');
const client = spawnNpm('dev:client');

const children = [server, client];
let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => {
    for (const child of children) {
      if (!child.killed) {
        child.kill('SIGKILL');
      }
    }
    process.exit(code);
  }, 600);
}

server.on('exit', (code) => {
  if (!shuttingDown) {
    shutdown(code ?? 1);
  }
});

client.on('exit', (code) => {
  if (!shuttingDown) {
    shutdown(code ?? 1);
  }
});

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
