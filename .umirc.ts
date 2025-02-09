import { defineConfig } from '@umijs/max';
import path from 'path';

export default defineConfig({
  hash: true,
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: false,
  npmClient: 'pnpm',
  plugins: [path.resolve(__dirname, './plugin/auto-generate-plugin.js')],
  devtool: 'source-map',
  clickToComponent: {
    editor: 'Trae',
  },
});
