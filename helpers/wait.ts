export default function wait(timeout = 2000): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeout)
  });
}