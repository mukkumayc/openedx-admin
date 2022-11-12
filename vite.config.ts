import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	css: {
		devSourcemap: true
	},
	plugins: [react(), visualizer()]
})
