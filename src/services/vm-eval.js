import vm from 'node:vm'
import stream from 'node:stream'

export function executeInUnsafeVM(code, ctx) {
  const result = { stdout: '', stderr: '', critical: '' }
  try {
    const createWriter = type => (chunk, encoding, callback) => {
      const data = chunk.toString()
      if (type === 'stdout') {
        result.stdout += data
      } else {
        result.stderr += data
      }
      callback();
    }

    const stdoutStream = new stream.Writable({ write: createWriter('stdout') });
    const stderrStream = new stream.Writable({ write: createWriter('stderr') });

    const context = {
      ctx,
      console: new console.Console(stdoutStream, stderrStream)
    };

    const script = new vm.Script(code);

    script.runInNewContext(context);

    return result
  } catch ({ message }) {
    result.critical = message
    return result
  }
}
