import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // 🚨 MUDANÇA NECESSÁRIA: O BASE deve ser o nome do seu repositório
  base: '/api-project-activity-sla/', 
})