import * as esbuild from 'esbuild';
import { copyFile } from 'fs/promises';

// Build the service worker
await esbuild.build({
	entryPoints: ['src/background/service-worker.ts'],
	bundle: true,
	outfile: 'static/service-worker.js',
	format: 'esm',
	platform: 'browser',
	target: 'chrome114',
	sourcemap: true
});

console.log('✓ Service worker compiled to static/service-worker.js');
