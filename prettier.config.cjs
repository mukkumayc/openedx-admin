/* eslint-env node */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const prettierConfigStandard = require('prettier-config-standard')

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const { endOfLine, useTabs, tabWidth, printWidth, ...rest } =
	prettierConfigStandard

module.exports = {
	...rest,
	plugins: ['./node_modules/@trivago/prettier-plugin-sort-imports'],
	importOrder: ['^[./]'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true
}
