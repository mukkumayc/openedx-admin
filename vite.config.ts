import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

export default defineConfig({
	css: {
		devSourcemap: true
	},
	plugins: [react(), visualizer()]
})
