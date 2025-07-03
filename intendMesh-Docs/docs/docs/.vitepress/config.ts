import { defineConfig } from 'vitepress';
// import sidebar from './sidebar';

export default defineConfig({
  title: 'IntentMesh',
  description: 'IntentMesh SDK & Dashboard documentation',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Dashboard', link: 'http://intentmesh.ai' }
    ],
    logo: '/logo.svg',
  }
});